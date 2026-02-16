using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class SocialLink : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
