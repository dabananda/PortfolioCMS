using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.UserProfile;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserProfileService(
            ApplicationDbContext context,
            ICurrentUserService currentUserService,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<UserProfileResponse?> GetMyProfileAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var profile = await _context.UserProfiles
                .AsNoTracking()
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null) return null;

            return UserProfileMapper.ToResponse(profile, profile.User!);
        }

        public async Task<UserProfileResponse> CreateAsync(CreateUserProfileRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var exists = await _context.UserProfiles.AnyAsync(p => p.UserId == userId);
            if (exists)
                throw new AppConflictException("A profile already exists. Use the update endpoint instead.");

            var entity = UserProfileMapper.ToEntity(request, userId);

            await _context.UserProfiles.AddAsync(entity);
            await _context.SaveChangesAsync();

            // Reload with user navigation for the response
            await _context.Entry(entity).Reference(p => p.User).LoadAsync();

            return UserProfileMapper.ToResponse(entity, entity.User!);
        }

        public async Task<UserProfileResponse> UpdateAsync(UpdateUserProfileRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var entity = await _context.UserProfiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId)
                ?? throw new AppNotFoundException("Profile not found. Create one first.");

            UserProfileMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return UserProfileMapper.ToResponse(entity, entity.User!);
        }
    }
}
