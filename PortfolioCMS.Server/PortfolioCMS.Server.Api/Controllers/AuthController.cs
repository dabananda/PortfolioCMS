using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Auth;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    [AllowAnonymous]
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            return ApiOk(response, "Login successful.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var message = await _authService.RegisterAsync(request);
            return ApiOkMessage(message);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
            [FromQuery] string userId, [FromQuery] string token)
        {
            await _authService.ConfirmEmailAsync(userId, token);
            return ApiOkMessage("Email confirmed successfully.");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            await _authService.ForgotPasswordAsync(request.Email);
            return ApiOkMessage("If the email exists, a reset link has been sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            await _authService.ResetPasswordAsync(request);
            return ApiOkMessage("Password has been reset successfully.");
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var response = await _authService.RefreshTokenAsync(request.RefreshToken);
            return ApiOk(response, "Token refreshed successfully.");
        }
    }
}