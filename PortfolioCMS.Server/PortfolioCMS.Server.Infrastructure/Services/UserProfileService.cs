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

        /// <summary>
        /// Always returns a non-null response.
        /// For new users who have not created a profile yet, returns a skeleton
        /// response with only their identity data (FirstName, LastName, Email)
        /// and HasProfile = false, so the frontend knows to call POST instead of PUT.
        /// </summary>
        public async Task<UserProfileResponse> GetMyProfileAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            // We always need the ApplicationUser to get FirstName / LastName / Email.
            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new AppNotFoundException("Authenticated user not found.");

            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            // No profile row yet — return skeleton with identity data only.
            if (profile is null)
                return UserProfileMapper.ToEmptyResponse(user);

            return UserProfileMapper.ToResponse(profile, user);
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

            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new AppNotFoundException("Authenticated user not found.");

            return UserProfileMapper.ToResponse(entity, user);
        }

        public async Task<UserProfileResponse> UpdateAsync(UpdateUserProfileRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var entity = await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId)
                ?? throw new AppNotFoundException("Profile not found. Create one first.");

            UserProfileMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new AppNotFoundException("Authenticated user not found.");

            return UserProfileMapper.ToResponse(entity, user);
        }
    }
}