using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public enum ProficiencyLevel
    {
        Beginner,
        Intermediate,
        Advanced,
        Expert
    }

    public class Skill : BaseEntity
    {
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public ProficiencyLevel Proficiency { get; set; } = ProficiencyLevel.Intermediate;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}