using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Skill : BaseEntity
    {
        public string SkillName { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
