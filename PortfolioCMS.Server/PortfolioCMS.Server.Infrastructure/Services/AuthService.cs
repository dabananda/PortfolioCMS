using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using PortfolioCMS.Server.Application.DTOs.Auth;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Common.Exceptions;
using PortfolioCMS.Server.Domain.Entities;
using System.Text;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            TokenService tokenService,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new UnauthorizedException("Invalid email or password.");

            if (!await _userManager.IsEmailConfirmedAsync(user))
                throw new UnauthorizedException("Email is not confirmed. Please check your inbox.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

            if (result.IsLockedOut)
                throw new UnauthorizedException("Account is temporarily locked due to too many failed attempts. Please try again later.");

            if (!result.Succeeded)
                throw new UnauthorizedException("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            return new AuthResponse
            {
                Id = user.Id.ToString(),
                Email = user.Email!,
                Token = token,
                Roles = roles
            };
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                throw new ConflictException("An account with this email already exists.");

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ValidationException($"Registration failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, Role.User);

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));
            var frontend = _configuration["FrontendBaseUrl"]
                ?? throw new InvalidOperationException("FrontendBaseUrl is not configured.");
            var confirmationLink = $"{frontend}/confirm-email?userid={user.Id}&token={encodedToken}";

            await _emailService.SendEmailAsync(
                user.Email!,
                "Confirm your email",
                $"Please confirm your email by clicking <a href='{confirmationLink}' target='_blank'>here</a>.");

            return "Registration successful! Please check your email to confirm your account.";
        }

        public async Task ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new NotFoundException("User not found.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ValidationException($"Email confirmation failed: {errors}");
            }
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            // Silently return if user not found or email not confirmed — prevents user enumeration
            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                return;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var frontend = _configuration["FrontendBaseUrl"]
                ?? throw new InvalidOperationException("FrontendBaseUrl is not configured.");
            var resetLink = $"{frontend}/reset-password?email={email}&token={encodedToken}";

            await _emailService.SendEmailAsync(
                email,
                "Reset your password",
                $"You can reset your password by clicking <a href='{resetLink}' target='_blank'>here</a>. This link is valid for a limited time.");
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new NotFoundException("User not found.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ValidationException($"Password reset failed: {errors}");
            }
        }
    }
}