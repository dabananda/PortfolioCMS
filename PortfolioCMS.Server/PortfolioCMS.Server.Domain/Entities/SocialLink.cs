using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class SocialLink : BaseEntity
    {
        public String Name { get; set; } = String.Empty;
        public String Link { get; set; } = String.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
