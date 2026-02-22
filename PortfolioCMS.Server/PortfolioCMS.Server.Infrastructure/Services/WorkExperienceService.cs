using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.WorkExperience;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class WorkExperienceService : IWorkExperienceService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public WorkExperienceService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<WorkExperienceResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var experiences = await _context.WorkExperiences
                .AsNoTracking()
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.StartDate)
                .ToListAsync();

            return WorkExperienceMapper.ToResponseList(experiences);
        }

        public async Task<WorkExperienceResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedExperienceAsync(id);
            return WorkExperienceMapper.ToResponse(entity);
        }

        public async Task<WorkExperienceResponse> CreateAsync(CreateWorkExperienceRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            var entity = WorkExperienceMapper.ToEntity(request, userId);

            await _context.WorkExperiences.AddAsync(entity);
            await _context.SaveChangesAsync();

            return WorkExperienceMapper.ToResponse(entity);
        }

        public async Task<WorkExperienceResponse> UpdateAsync(Guid id, UpdateWorkExperienceRequest request)
        {
            var entity = await FindOwnedExperienceAsync(id);

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            WorkExperienceMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return WorkExperienceMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedExperienceAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<WorkExperience> FindOwnedExperienceAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.WorkExperiences
                .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId)
                ?? throw new AppNotFoundException($"Work experience with ID '{id}' was not found.");
        }
    }
}
