using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.BlogPostCategory;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class BlogPostCategoryService : IBlogPostCategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public BlogPostCategoryService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<BlogPostCategoryResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var categories = await _context.BlogPostCategories
                .AsNoTracking()
                .Include(c => c.BlogPosts.Where(p => !p.IsDeleted))
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Name)
                .ToListAsync();

            return BlogPostCategoryMapper.ToResponseList(categories);
        }

        public async Task<BlogPostCategoryResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedCategoryAsync(id);
            var postCount = await _context.BlogPosts.CountAsync(p => p.BlogPostCategoryId == id && !p.IsDeleted);
            return BlogPostCategoryMapper.ToResponse(entity, postCount);
        }

        public async Task<BlogPostCategoryResponse> CreateAsync(CreateBlogPostCategoryRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.BlogPostCategories
                .AnyAsync(c => c.UserId == userId && c.Name == request.Name.Trim());

            if (duplicate)
                throw new AppConflictException($"Category '{request.Name}' already exists.");

            var entity = BlogPostCategoryMapper.ToEntity(request, userId);

            await _context.BlogPostCategories.AddAsync(entity);
            await _context.SaveChangesAsync();

            return BlogPostCategoryMapper.ToResponse(entity, 0);
        }

        public async Task<BlogPostCategoryResponse> UpdateAsync(Guid id, UpdateBlogPostCategoryRequest request)
        {
            var entity = await FindOwnedCategoryAsync(id);
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.BlogPostCategories
                .AnyAsync(c => c.UserId == userId && c.Name == request.Name.Trim() && c.Id != id);

            if (duplicate)
                throw new AppConflictException($"Category '{request.Name}' already exists.");

            BlogPostCategoryMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            var postCount = await _context.BlogPosts.CountAsync(p => p.BlogPostCategoryId == id && !p.IsDeleted);
            return BlogPostCategoryMapper.ToResponse(entity, postCount);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedCategoryAsync(id);

            var hasActivePosts = await _context.BlogPosts
                .AnyAsync(p => p.BlogPostCategoryId == id && !p.IsDeleted);

            if (hasActivePosts)
                throw new AppConflictException("Cannot delete a category that has blog posts. Reassign or delete the posts first.");

            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<BlogPostCategory> FindOwnedCategoryAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.BlogPostCategories
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId)
                ?? throw new AppNotFoundException($"Blog post category with ID '{id}' was not found.");
        }
    }
}
