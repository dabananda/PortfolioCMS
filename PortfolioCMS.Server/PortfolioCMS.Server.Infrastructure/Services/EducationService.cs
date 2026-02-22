using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Education;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class EducationService : IEducationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public EducationService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<EducationResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var educations = await _context.Educations
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return EducationMapper.ToResponseList(educations);
        }

        public async Task<EducationResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedEducationAsync(id);
            return EducationMapper.ToResponse(entity);
        }

        public async Task<EducationResponse> CreateAsync(CreateEducationRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            var entity = EducationMapper.ToEntity(request, userId);

            await _context.Educations.AddAsync(entity);
            await _context.SaveChangesAsync();

            return EducationMapper.ToResponse(entity);
        }

        public async Task<EducationResponse> UpdateAsync(Guid id, UpdateEducationRequest request)
        {
            var entity = await FindOwnedEducationAsync(id);

            if (request.EndDate.HasValue && request.EndDate.Value <= request.StartDate)
                throw new AppValidationException("End date must be after start date.");

            EducationMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return EducationMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedEducationAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<Education> FindOwnedEducationAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.Educations
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId)
                ?? throw new AppNotFoundException($"Education with ID '{id}' was not found.");
        }
    }
}
