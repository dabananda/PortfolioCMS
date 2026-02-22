using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.WorkExperience
{
    public class CreateWorkExperienceRequest
    {
        [Required(ErrorMessage = "Company name is required.")]
        [MaxLength(200, ErrorMessage = "Company name cannot exceed 200 characters.")]
        public string CompanyName { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Company description cannot exceed 1000 characters.")]
        public string? CompanyDescription { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        [MaxLength(200, ErrorMessage = "Role cannot exceed 200 characters.")]
        public string Role { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required.")]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        [MaxLength(2000, ErrorMessage = "Work description cannot exceed 2000 characters.")]
        public string? WorkDescription { get; set; }
    }

    public class UpdateWorkExperienceRequest : CreateWorkExperienceRequest { }
}
