using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.ContactMessage
{
    public class SendContactMessageRequest
    {
        [Required(ErrorMessage = "Full name is required.")]
        [MaxLength(100, ErrorMessage = "Full name cannot exceed 100 characters.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "A valid email address is required.")]
        [MaxLength(256, ErrorMessage = "Email address cannot exceed 256 characters.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subject is required.")]
        [MaxLength(200, ErrorMessage = "Subject cannot exceed 200 characters.")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Message body is required.")]
        [MinLength(10, ErrorMessage = "Message must be at least 10 characters.")]
        [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;
    }

    public class ContactMessageFilterRequest
    {
        public bool? IsRead { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
