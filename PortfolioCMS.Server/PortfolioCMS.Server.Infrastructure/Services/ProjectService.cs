using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Project;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ProjectService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ProjectResponse> CreateProjectAsync(CreateProjectRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var entity = ProjectMapper.ToEntity(request, userId);

            _context.Projects.Add(entity);
            await _context.SaveChangesAsync();

            return ProjectMapper.ToResponse(entity);
        }

        public async Task DeleteProjectAsync(Guid id)
        {
            var entity = await FindOwnedProjectAsync(id);

            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        public async Task<ProjectResponse> GetProjectByIdAsync(Guid id)
        {
            var entity = await FindOwnedProjectAsync(id);
            return ProjectMapper.ToResponse(entity);
        }

        public async Task<IReadOnlyList<ProjectResponse>> GetProjectsAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var projects = await _context.Projects.AsNoTracking().Where(p => p.UserId == userId).OrderByDescending(p => p.CreatedAt).ToListAsync();

            return ProjectMapper.ToResponseList(projects);
        }

        public async Task<ProjectResponse> UpdateProjectAsync(Guid id, UpdateProjectRequest request)
        {
            var entity = await FindOwnedProjectAsync(id);
            
            ProjectMapper.ApplyUpdate(request, entity);
            
            await _context.SaveChangesAsync();

            return ProjectMapper.ToResponse(entity);
        }

        // Helper method to ensure users can only access their own projects
        private async Task<Project> FindOwnedProjectAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId)
                ?? throw new AppNotFoundException($"Project with ID '{id}' was not found.");
        }
    }
}
