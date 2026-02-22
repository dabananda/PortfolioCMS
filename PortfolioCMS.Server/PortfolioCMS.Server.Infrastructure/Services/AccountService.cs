using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Account;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICurrentUserService _currentUserService;
        private readonly ApplicationDbContext _context;

        public AccountService(
            UserManager<ApplicationUser> userManager,
            ICurrentUserService currentUserService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _currentUserService = currentUserService;
            _context = context;
        }

        public async Task ChangePasswordAsync(ChangePasswordRequest request)
        {
            var user = await GetCurrentUserAsync();

            var result = await _userManager.ChangePasswordAsync(
                user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Password change failed: {errors}");
            }
        }

        public async Task UpdateNameAsync(UpdateNameRequest request)
        {
            var user = await GetCurrentUserAsync();

            user.FirstName = request.FirstName.Trim();
            user.LastName = request.LastName.Trim();

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Name update failed: {errors}");
            }
        }

        public async Task DeleteAccountAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();
            var user = await GetCurrentUserAsync();

            // Revoke all active refresh tokens so existing sessions are invalidated immediately
            var activeTokens = await _context.RefreshTokens
                .Where(t => t.UserId == userId && t.RevokedAt == null)
                .ToListAsync();

            foreach (var token in activeTokens)
                token.RevokedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Account deletion failed: {errors}");
            }
        }

        // Helpers
        private async Task<ApplicationUser> GetCurrentUserAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();
            return await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new AppNotFoundException("User account not found.");
        }
    }
}