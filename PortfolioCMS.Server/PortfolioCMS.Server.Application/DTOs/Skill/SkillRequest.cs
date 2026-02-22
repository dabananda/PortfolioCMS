using PortfolioCMS.Server.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Skill
{
    public class CreateSkillRequest
    {
        [Required(ErrorMessage = "Skill name is required.")]
        [MaxLength(100, ErrorMessage = "Skill name cannot exceed 100 characters.")]
        public string SkillName { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
        public string? Category { get; set; }

        [Required(ErrorMessage = "Proficiency level is required.")]
        public ProficiencyLevel Proficiency { get; set; } = ProficiencyLevel.Intermediate;
    }

    public class UpdateSkillRequest
    {
        [Required(ErrorMessage = "Skill name is required.")]
        [MaxLength(100, ErrorMessage = "Skill name cannot exceed 100 characters.")]
        public string SkillName { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
        public string? Category { get; set; }

        [Required(ErrorMessage = "Proficiency level is required.")]
        public ProficiencyLevel Proficiency { get; set; } = ProficiencyLevel.Intermediate;
    }
}
