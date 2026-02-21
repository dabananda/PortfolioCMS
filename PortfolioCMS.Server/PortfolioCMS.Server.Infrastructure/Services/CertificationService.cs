using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Certification;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class CertificationService : ICertificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CertificationService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<CertificationResponse> CreateAsync(CreateCertificationRequest request)
        {
            var userId = GetAuthenticatedUserId();

            var entity = CertificationMapper.ToEntity(request, userId);

            await _context.Certifications.AddAsync(entity);
            await _context.SaveChangesAsync();

            return CertificationMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedCertificationAsync(id);

            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<CertificationResponse>> GetAllAsync()
        {
            var userId = GetAuthenticatedUserId();

            var certifications = await _context.Certifications.AsNoTracking().Where(c => c.UserId == userId).OrderByDescending(c => c.DateObtained).ToListAsync();
            
            return CertificationMapper.ToResponseList(certifications);
        }

        public async Task<CertificationResponse> GetByIdAsync(Guid id)
        {
            var certification = await FindOwnedCertificationAsync(id);
            return CertificationMapper.ToResponse(certification);
        }

        public async Task<CertificationResponse> UpdateAsync(Guid id, UpdateCertificationRequest request)
        {
            var entity = await FindOwnedCertificationAsync(id);

            CertificationMapper.ApplyUpdate(request, entity);

            await _context.SaveChangesAsync();

            return CertificationMapper.ToResponse(entity);
        }

        // Helper methods
        private Guid GetAuthenticatedUserId()
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId is null)
                throw new AppUnauthorizedException("User is not authenticated.");

            return _currentUserService.UserId.Value;
        }

        private async Task<Certification> FindOwnedCertificationAsync(Guid id)
        {
            var userId = GetAuthenticatedUserId();

            var entity = await _context.Certifications.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId)
                ?? throw new AppNotFoundException($"Certification with ID '{id}' was not found.");

            return entity;
        }
    }
}
