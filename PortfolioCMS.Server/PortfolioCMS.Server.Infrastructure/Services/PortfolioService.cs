using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.DTOs.Portfolio;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PortfolioService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<PublicPortfolioResponse> GetPortfolioAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username)
                ?? throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            var userId = user.Id;

            // Sequential awaits to avoid DbContext concurrency violations.
            // DbContext is not thread-safe; Task.WhenAll causes concurrent operations on the same instance.
            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId)
                ?? throw new AppNotFoundException($"Portfolio for '{username}' is not set up yet.");

            // Privacy gate — checked early so we skip remaining queries if private
            if (!profile.IsPublic)
                throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            var skills = await _context.Skills
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Category).ThenBy(s => s.SkillName)
                .ToListAsync();

            var educations = await _context.Educations
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            var workExperiences = await _context.WorkExperiences
                .AsNoTracking()
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.StartDate)
                .ToListAsync();

            var projects = await _context.Projects
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var certifications = await _context.Certifications
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.DateObtained)
                .ToListAsync();

            var socialLinks = await _context.SocialLinks
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Name)
                .ToListAsync();

            var reviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var activities = await _context.ExtraCurricularActivities
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.StartDate)
                .ToListAsync();

            var problemSolvings = await _context.ProblemSolvings
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.JudgeName)
                .ToListAsync();

            return new PublicPortfolioResponse
            {
                Profile = new PublicProfileResponse
                {
                    Username = username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    HeadLine = profile.HeadLine,
                    Status = profile.Status,
                    ImageUrl = profile.ImageUrl,
                    ResumeUrl = profile.ResumeUrl,
                    Location = profile.Location,
                    DateOfBirth = (DateOnly)profile.DateOfBirth
                },
                Skills = SkillMapper.ToResponseList(skills),
                Educations = EducationMapper.ToResponseList(educations),
                WorkExperiences = WorkExperienceMapper.ToResponseList(workExperiences),
                Projects = ProjectMapper.ToResponseList(projects),
                Certifications = CertificationMapper.ToResponseList(certifications),
                SocialLinks = SocialLinkMapper.ToResponseList(socialLinks),
                Reviews = ReviewMapper.ToResponseList(reviews),
                ExtraCurricularActivities = ExtraCurricularActivityMapper.ToResponseList(activities),
                ProblemSolvings = ProblemSolvingMapper.ToResponseList(problemSolvings)
            };
        }

        public async Task<BlogPostPagedResponse> GetPublishedBlogPostsAsync(string username, BlogPostFilterRequest filter)
        {
            var user = await _userManager.FindByNameAsync(username)
                ?? throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            // Enforce privacy — block blog access too if portfolio is private
            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == user.Id);

            if (profile is null || !profile.IsPublic)
                throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            var page = Math.Max(1, filter.Page);
            var pageSize = Math.Clamp(filter.PageSize, 1, 50);

            var query = _context.BlogPosts
                .AsNoTracking()
                .Include(p => p.BlogPostCategory)
                .Where(p => p.UserId == user.Id && p.IsPublished);

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
                .OrderByDescending(p => p.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return BlogPostMapper.ToPagedResponse(pageItems, totalCount, page, pageSize);
        }

        public async Task<BlogPostResponse> GetPublishedBlogPostBySlugAsync(string username, string slug)
        {
            var user = await _userManager.FindByNameAsync(username)
                ?? throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == user.Id);

            if (profile is null || !profile.IsPublic)
                throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

            var post = await _context.BlogPosts
                .AsNoTracking()
                .Include(p => p.BlogPostCategory)
                .FirstOrDefaultAsync(p => p.Slug == slug && p.UserId == user.Id && p.IsPublished)
                ?? throw new AppNotFoundException($"Blog post with slug '{slug}' was not found.");

            return BlogPostMapper.ToResponse(post);
        }
    }
}