using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class ExtraCurricularActivityService : IExtraCurricularActivityService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ExtraCurricularActivityService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<ExtraCurricularActivityResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var activities = await _context.ExtraCurricularActivities
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.StartDate)
                .ToListAsync();

            return ExtraCurricularActivityMapper.ToResponseList(activities);
        }

        public async Task<ExtraCurricularActivityResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedActivityAsync(id);
            return ExtraCurricularActivityMapper.ToResponse(entity);
        }

        public async Task<ExtraCurricularActivityResponse> CreateAsync(CreateExtraCurricularActivityRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            var entity = ExtraCurricularActivityMapper.ToEntity(request, userId);

            await _context.ExtraCurricularActivities.AddAsync(entity);
            await _context.SaveChangesAsync();

            return ExtraCurricularActivityMapper.ToResponse(entity);
        }

        public async Task<ExtraCurricularActivityResponse> UpdateAsync(Guid id, UpdateExtraCurricularActivityRequest request)
        {
            var entity = await FindOwnedActivityAsync(id);

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            ExtraCurricularActivityMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return ExtraCurricularActivityMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedActivityAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<ExtraCurricularActivity> FindOwnedActivityAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.ExtraCurricularActivities
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId)
                ?? throw new AppNotFoundException($"Extra-curricular activity with ID '{id}' was not found.");
        }
    }
}
