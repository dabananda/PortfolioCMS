using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PortfolioCMS.Server.Application.DTOs.Auth;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;
using System.Text;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            IConfiguration configuration,
            ApplicationDbContext context,
            JwtSettings jwtSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _configuration = configuration;
            _context = context;
            _jwtSettings = jwtSettings;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new AppUnauthorizedException("Invalid email or password.");

            if (!await _userManager.IsEmailConfirmedAsync(user))
                throw new AppUnauthorizedException("Please confirm your email before logging in.");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, request.Password, lockoutOnFailure: true);

            if (result.IsLockedOut)
                throw new AppUnauthorizedException(
                    "Account is temporarily locked due to too many failed attempts. Try again later.");

            if (!result.Succeeded)
                throw new AppUnauthorizedException("Invalid email or password.");

            return await IssueAuthResponseAsync(user);
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            // Normalize username to lowercase for case-insensitive uniqueness
            var normalizedUsername = request.Username.ToLowerInvariant();

            // Check email uniqueness
            if (await _userManager.FindByEmailAsync(request.Email) is not null)
                throw new AppConflictException("An account with this email already exists.");

            // Check username uniqueness
            if (await _userManager.FindByNameAsync(normalizedUsername) is not null)
                throw new AppConflictException($"The username '{normalizedUsername}' is already taken.");

            var user = new ApplicationUser
            {
                UserName = normalizedUsername,   // public handle — portfolio URL key
                Email = request.Email,
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim()
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Registration failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, Role.User);
            await SendEmailConfirmationAsync(user);

            return "Registration successful! Please check your email to confirm your account.";
        }

        public async Task ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppNotFoundException("User not found.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Email confirmation failed: {errors}");
            }
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                return;  // Silent — never reveal whether an email exists

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var frontend = GetFrontendBaseUrl();
            var resetLink = $"{frontend}/reset-password?email={email}&token={encodedToken}";

            await _emailService.SendEmailAsync(
                email,
                "Reset your password",
                $"You can reset your password by clicking <a href='{resetLink}' target='_blank'>here</a>. This link is valid for a limited time.");
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new AppNotFoundException("User not found.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new AppValidationException($"Password reset failed: {errors}");
            }
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == refreshToken)
                ?? throw new AppUnauthorizedException("Invalid refresh token.");

            if (!storedToken.IsActive)
                throw new AppUnauthorizedException("Refresh token has expired or been revoked.");

            storedToken.RevokedAt = DateTime.UtcNow;
            var newRawToken = _tokenService.GenerateRefreshToken();
            storedToken.ReplacedByToken = newRawToken;

            _context.RefreshTokens.Add(new RefreshToken
            {
                Token = newRawToken,
                UserId = storedToken.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return await IssueAuthResponseAsync(storedToken.User!);
        }

        public async Task<bool> IsUsernameAvailableAsync(string username)
        {
            var normalized = username.ToLowerInvariant();
            return await _userManager.FindByNameAsync(normalized) is null;
        }

        // Helpers
        private async Task<AuthResponse> IssueAuthResponseAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.CreateAccessToken(user, roles);
            var rawRefresh = _tokenService.GenerateRefreshToken();

            // Revoke all currently active refresh tokens for this user (single-session policy)
            var activeTokens = await _context.RefreshTokens
                .Where(t => t.UserId == user.Id && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();
            foreach (var t in activeTokens)
                t.RevokedAt = DateTime.UtcNow;

            _context.RefreshTokens.Add(new RefreshToken
            {
                Token = rawRefresh,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                Id = user.Id.ToString(),
                Username = user.UserName!,
                Email = user.Email!,
                AccessToken = accessToken,
                RefreshToken = rawRefresh,
                Roles = roles
            };
        }

        private async Task SendEmailConfirmationAsync(ApplicationUser user)
        {
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));
            var frontend = GetFrontendBaseUrl();
            var confirmLink = $"{frontend}/confirm-email?userid={user.Id}&token={encodedToken}";

            await _emailService.SendEmailAsync(
                user.Email!,
                "Confirm your email",
                $"Please confirm your email by clicking <a href='{confirmLink}' target='_blank'>here</a>.");
        }

        private string GetFrontendBaseUrl() =>
            _configuration["FrontendBaseUrl"]
                ?? throw new InvalidOperationException("FrontendBaseUrl is not configured.");
    }
}