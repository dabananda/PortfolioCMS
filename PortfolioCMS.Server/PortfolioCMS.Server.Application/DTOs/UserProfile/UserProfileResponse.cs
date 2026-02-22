using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Application.DTOs.UserProfile
{
    public class UserProfileResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public UserStatus Status { get; set; }
        public string HeadLine { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public string? Location { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
