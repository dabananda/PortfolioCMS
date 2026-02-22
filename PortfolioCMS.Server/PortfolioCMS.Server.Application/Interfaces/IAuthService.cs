using PortfolioCMS.Server.Application.DTOs.Auth;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<string> RegisterAsync(RegisterRequest request);
        Task ConfirmEmailAsync(string userId, string token);
        Task ForgotPasswordAsync(string email);
        Task ResetPasswordAsync(ResetPasswordRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> IsUsernameAvailableAsync(string username);
    }
}