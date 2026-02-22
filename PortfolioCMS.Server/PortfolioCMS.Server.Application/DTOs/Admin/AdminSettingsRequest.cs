using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Admin
{
    public class UpdateSystemSettingRequest
    {
        [Required(ErrorMessage = "SMTP host is required.")]
        [MaxLength(200, ErrorMessage = "SMTP host cannot exceed 200 characters.")]
        public string SmtpHost { get; set; } = string.Empty;

        [Required(ErrorMessage = "SMTP port is required.")]
        [Range(1, 65535, ErrorMessage = "SMTP port must be between 1 and 65535.")]
        public int SmtpPort { get; set; } = 587;

        [Required(ErrorMessage = "SMTP username is required.")]
        [MaxLength(200, ErrorMessage = "SMTP username cannot exceed 200 characters.")]
        public string SmtpUser { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? SmtpPassword { get; set; }

        [Required(ErrorMessage = "Sender name is required.")]
        [MaxLength(200, ErrorMessage = "Sender name cannot exceed 200 characters.")]
        public string SenderName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Sender email is required.")]
        [EmailAddress(ErrorMessage = "Sender email must be a valid email address.")]
        [MaxLength(256, ErrorMessage = "Sender email cannot exceed 256 characters.")]
        public string SenderEmail { get; set; } = string.Empty;

        public bool EnableSsl { get; set; } = true;
    }

    public class SystemSettingResponse
    {
        public Guid Id { get; set; }
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SmtpUser { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;
        public bool EnableSsl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class UpdateCorsSettingRequest
    {
        [Required(ErrorMessage = "At least one allowed origin is required.")]
        [MinLength(1, ErrorMessage = "At least one allowed origin is required.")]
        public List<string> AllowedOrigins { get; set; } = [];
    }

    public class CorsSettingResponse
    {
        public Guid Id { get; set; }
        public List<string> AllowedOrigins { get; set; } = [];
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
