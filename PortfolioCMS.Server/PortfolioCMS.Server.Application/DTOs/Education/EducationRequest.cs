using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Education
{
    public class CreateEducationRequest
    {
        [Required(ErrorMessage = "Institute name is required.")]
        [MaxLength(200, ErrorMessage = "Institute name cannot exceed 200 characters.")]
        public string InstituteName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        [MaxLength(200, ErrorMessage = "Department cannot exceed 200 characters.")]
        public string Department { get; set; } = string.Empty;

        [Required(ErrorMessage = "CGPA is required.")]
        [Range(0.0, 10.0, ErrorMessage = "CGPA must be between 0 and 10.")]
        public decimal CGPA { get; set; }

        [Required(ErrorMessage = "Scale is required.")]
        [Range(0.0, 10.0, ErrorMessage = "Scale must be between 0 and 10.")]
        public decimal Scale { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        [Required(ErrorMessage = "Institute location is required.")]
        [MaxLength(200, ErrorMessage = "Institute location cannot exceed 200 characters.")]
        public string InstituteLocation { get; set; } = string.Empty;
    }

    public class UpdateEducationRequest : CreateEducationRequest { }
}
