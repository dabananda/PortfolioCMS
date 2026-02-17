using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Auth
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
