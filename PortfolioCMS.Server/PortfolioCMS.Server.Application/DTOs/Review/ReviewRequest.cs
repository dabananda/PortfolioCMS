using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Review
{
    public class CreateReviewRequest
    {
        [Required(ErrorMessage = "Reviewer name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Designation cannot exceed 100 characters.")]
        public string? Designation { get; set; }

        [Required(ErrorMessage = "Rating is required.")]
        [Range(1.0, 5.0, ErrorMessage = "Rating must be between 1 and 5.")]
        public decimal Rating { get; set; }

        [Required(ErrorMessage = "Comment is required.")]
        [MinLength(10, ErrorMessage = "Comment must be at least 10 characters.")]
        [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string Comment { get; set; } = string.Empty;
    }

    public class UpdateReviewRequest : CreateReviewRequest { }
}
