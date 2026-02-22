using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public BlogPostService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<BlogPostPagedResponse> GetAllAsync(BlogPostFilterRequest filter)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var page = Math.Max(1, filter.Page);
            var pageSize = Math.Clamp(filter.PageSize, 1, 50);

            var query = _context.BlogPosts
                .AsNoTracking()
                .Include(p => p.BlogPostCategory)
                .Where(p => p.UserId == userId);

            if (filter.IsPublished.HasValue)
                query = query.Where(p => p.IsPublished == filter.IsPublished.Value);

            if (filter.CategoryId.HasValue)
                query = query.Where(p => p.BlogPostCategoryId == filter.CategoryId.Value);

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.Trim().ToLower();
                query = query.Where(p =>
                    p.Title.ToLower().Contains(search) ||
                    (p.Summary != null && p.Summary.ToLower().Contains(search)));
            }

            var totalCount = await query.CountAsync();

            var pageItems = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return BlogPostMapper.ToPagedResponse(pageItems, totalCount, page, pageSize);
        }

        public async Task<BlogPostResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedPostAsync(id);
            return BlogPostMapper.ToResponse(entity);
        }

        public async Task<BlogPostResponse> GetBySlugAsync(string slug)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var entity = await _context.BlogPosts
                .AsNoTracking()
                .Include(p => p.BlogPostCategory)
                .FirstOrDefaultAsync(p => p.Slug == slug && p.UserId == userId)
                ?? throw new AppNotFoundException($"Blog post with slug '{slug}' was not found.");

            return BlogPostMapper.ToResponse(entity);
        }

        public async Task<BlogPostResponse> CreateAsync(CreateBlogPostRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            await ValidateCategoryOwnershipAsync(request.BlogPostCategoryId, userId);

            var slug = await GenerateUniqueSlugAsync(request.Title, userId);
            var entity = BlogPostMapper.ToEntity(request, userId, slug);

            await _context.BlogPosts.AddAsync(entity);
            await _context.SaveChangesAsync();

            // Reload with category navigation for the response
            await _context.Entry(entity).Reference(p => p.BlogPostCategory).LoadAsync();

            return BlogPostMapper.ToResponse(entity);
        }

        public async Task<BlogPostResponse> UpdateAsync(Guid id, UpdateBlogPostRequest request)
        {
            var entity = await FindOwnedPostAsync(id);
            var userId = _currentUserService.GetUserIdOrThrow();

            await ValidateCategoryOwnershipAsync(request.BlogPostCategoryId, userId);

            // Only regenerate slug if the title actually changed
            var slug = entity.Title.Equals(request.Title.Trim(), StringComparison.OrdinalIgnoreCase)
                ? entity.Slug
                : await GenerateUniqueSlugAsync(request.Title, userId, id);

            BlogPostMapper.ApplyUpdate(request, entity, slug);
            await _context.SaveChangesAsync();

            await _context.Entry(entity).Reference(p => p.BlogPostCategory).LoadAsync();

            return BlogPostMapper.ToResponse(entity);
        }

        public async Task<BlogPostResponse> PublishAsync(Guid id)
        {
            var entity = await FindOwnedPostAsync(id);

            if (entity.IsPublished)
                throw new AppConflictException("Blog post is already published.");

            entity.IsPublished = true;
            entity.PublishedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await _context.Entry(entity).Reference(p => p.BlogPostCategory).LoadAsync();

            return BlogPostMapper.ToResponse(entity);
        }

        public async Task<BlogPostResponse> UnpublishAsync(Guid id)
        {
            var entity = await FindOwnedPostAsync(id);

            if (!entity.IsPublished)
                throw new AppConflictException("Blog post is not published.");

            entity.IsPublished = false;
            entity.PublishedAt = null;

            await _context.SaveChangesAsync();
            await _context.Entry(entity).Reference(p => p.BlogPostCategory).LoadAsync();

            return BlogPostMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedPostAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        // Helpers
        private async Task<BlogPost> FindOwnedPostAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.BlogPosts
                .Include(p => p.BlogPostCategory)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId)
                ?? throw new AppNotFoundException($"Blog post with ID '{id}' was not found.");
        }

        private async Task ValidateCategoryOwnershipAsync(Guid categoryId, Guid userId)
        {
            var categoryExists = await _context.BlogPostCategories
                .AnyAsync(c => c.Id == categoryId && c.UserId == userId);

            if (!categoryExists)
                throw new AppNotFoundException($"Blog post category with ID '{categoryId}' was not found.");
        }

        private async Task<string> GenerateUniqueSlugAsync(string title, Guid userId, Guid? excludePostId = null)
        {
            var baseSlug = Slugify(title);

            var existingSlug = baseSlug;
            var suffix = 1;

            while (true)
            {
                var query = _context.BlogPosts.IgnoreQueryFilters()
                    .Where(p => p.Slug == existingSlug && p.UserId == userId);

                if (excludePostId.HasValue)
                    query = query.Where(p => p.Id != excludePostId.Value);

                if (!await query.AnyAsync())
                    return existingSlug;

                existingSlug = $"{baseSlug}-{suffix++}";
            }
        }

        private static string Slugify(string title)
        {
            if (string.IsNullOrWhiteSpace(title)) return "post";

            var str = title.ToLowerInvariant().Trim();

            // Replace accented characters
            str = Encoding.ASCII.GetString(Encoding.GetEncoding("Cyrillic").GetBytes(str));

            // Replace spaces and special chars with hyphens
            str = Regex.Replace(str, @"[^a-z0-9\s-]", string.Empty);
            str = Regex.Replace(str, @"[\s-]+", "-");
            str = str.Trim('-');

            return string.IsNullOrEmpty(str) ? "post" : str[..Math.Min(str.Length, 200)];
        }
    }
}
