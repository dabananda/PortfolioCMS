using PortfolioCMS.Server.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.UserProfile
{
    public class CreateUserProfileRequest
    {
        [Required(ErrorMessage = "Date of birth is required.")]
        public DateOnly DateOfBirth { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public UserStatus Status { get; set; } = UserStatus.Available;

        [Required(ErrorMessage = "Headline is required.")]
        [MaxLength(200, ErrorMessage = "Headline cannot exceed 200 characters.")]
        public string HeadLine { get; set; } = string.Empty;

        [Url(ErrorMessage = "Image URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        [Url(ErrorMessage = "Resume URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Resume URL cannot exceed 500 characters.")]
        public string? ResumeUrl { get; set; }

        [MaxLength(200, ErrorMessage = "Location cannot exceed 200 characters.")]
        public string? Location { get; set; }
    }

    public class UpdateUserProfileRequest : CreateUserProfileRequest { }
}
