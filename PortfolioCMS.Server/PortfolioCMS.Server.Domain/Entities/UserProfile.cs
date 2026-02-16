using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class UserProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public String Status { get; set; } = String.Empty;
        public String HeadLine { get; set; } = String.Empty;
        public String ImageUrl { get; set; } = String.Empty;
        public String ResumeUrl { get; set; } = String.Empty;
        public String? Location { get; set; }
    }
}
