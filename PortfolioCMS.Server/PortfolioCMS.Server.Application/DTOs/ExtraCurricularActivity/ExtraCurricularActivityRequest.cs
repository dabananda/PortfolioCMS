using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity
{
    public class CreateExtraCurricularActivityRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Organization is required.")]
        [MaxLength(200, ErrorMessage = "Organization cannot exceed 200 characters.")]
        public string Organization { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required.")]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }

    public class UpdateExtraCurricularActivityRequest : CreateExtraCurricularActivityRequest { }
}
