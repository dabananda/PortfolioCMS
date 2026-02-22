using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.SocialLink;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class SocialLinkService : ISocialLinkService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public SocialLinkService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<SocialLinkResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var links = await _context.SocialLinks
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Name)
                .ToListAsync();

            return SocialLinkMapper.ToResponseList(links);
        }

        public async Task<SocialLinkResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedLinkAsync(id);
            return SocialLinkMapper.ToResponse(entity);
        }

        public async Task<SocialLinkResponse> CreateAsync(CreateSocialLinkRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.SocialLinks
                .AnyAsync(s => s.UserId == userId && s.Name == request.Name.Trim());

            if (duplicate)
                throw new AppConflictException($"A social link for '{request.Name}' already exists.");

            var entity = SocialLinkMapper.ToEntity(request, userId);

            await _context.SocialLinks.AddAsync(entity);
            await _context.SaveChangesAsync();

            return SocialLinkMapper.ToResponse(entity);
        }

        public async Task<SocialLinkResponse> UpdateAsync(Guid id, UpdateSocialLinkRequest request)
        {
            var entity = await FindOwnedLinkAsync(id);
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.SocialLinks
                .AnyAsync(s => s.UserId == userId && s.Name == request.Name.Trim() && s.Id != id);

            if (duplicate)
                throw new AppConflictException($"A social link for '{request.Name}' already exists.");

            SocialLinkMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return SocialLinkMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedLinkAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<SocialLink> FindOwnedLinkAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.SocialLinks
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId)
                ?? throw new AppNotFoundException($"Social link with ID '{id}' was not found.");
        }
    }
}
