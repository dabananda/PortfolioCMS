using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Auth
{
    public class AuthResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = [];
    }
}
