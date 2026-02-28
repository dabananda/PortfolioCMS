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

            // Fan-out parallel queries for performance
            var profileTask = _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            var skillsTask = _context.Skills
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Category).ThenBy(s => s.SkillName)
                .ToListAsync();

            var educationsTask = _context.Educations
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            var workExperiencesTask = _context.WorkExperiences
                .AsNoTracking()
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.StartDate)
                .ToListAsync();

            var projectsTask = _context.Projects
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var certificationsTask = _context.Certifications
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.DateObtained)
                .ToListAsync();

            var socialLinksTask = _context.SocialLinks
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Name)
                .ToListAsync();

            var reviewsTask = _context.Reviews
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var activitiesTask = _context.ExtraCurricularActivities
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.StartDate)
                .ToListAsync();

            var problemSolvingsTask = _context.ProblemSolvings
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.JudgeName)
                .ToListAsync();

            await Task.WhenAll(
                profileTask, skillsTask, educationsTask, workExperiencesTask,
                projectsTask, certificationsTask, socialLinksTask, reviewsTask,
                activitiesTask, problemSolvingsTask);

            var profile = profileTask.Result
                ?? throw new AppNotFoundException($"Portfolio for '{username}' is not set up yet.");

            // Privacy gate
            if (!profile.IsPublic)
                throw new AppNotFoundException($"Portfolio for '{username}' was not found.");

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
                    DateOfBirth = (DateOnly) profile.DateOfBirth
                },
                Skills = SkillMapper.ToResponseList(skillsTask.Result),
                Educations = EducationMapper.ToResponseList(educationsTask.Result),
                WorkExperiences = WorkExperienceMapper.ToResponseList(workExperiencesTask.Result),
                Projects = ProjectMapper.ToResponseList(projectsTask.Result),
                Certifications = CertificationMapper.ToResponseList(certificationsTask.Result),
                SocialLinks = SocialLinkMapper.ToResponseList(socialLinksTask.Result),
                Reviews = ReviewMapper.ToResponseList(reviewsTask.Result),
                ExtraCurricularActivities = ExtraCurricularActivityMapper.ToResponseList(activitiesTask.Result),
                ProblemSolvings = ProblemSolvingMapper.ToResponseList(problemSolvingsTask.Result)
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