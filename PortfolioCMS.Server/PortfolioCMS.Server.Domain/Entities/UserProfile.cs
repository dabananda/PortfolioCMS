using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class UserProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public UserStatus Status { get; set; } = UserStatus.Available;
        public string HeadLine { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ResumeUrl { get; set; }

        public string? Location { get; set; }
    }
}