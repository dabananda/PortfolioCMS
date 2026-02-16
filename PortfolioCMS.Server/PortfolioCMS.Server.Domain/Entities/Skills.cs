using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Skills : BaseEntity
    {
        public String SkillName { get; set; } = String.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
