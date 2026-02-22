using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.DTOs.Skill
{
    public class SkillResponse
    {
        public Guid Id { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public ProficiencyLevel Proficiency { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
