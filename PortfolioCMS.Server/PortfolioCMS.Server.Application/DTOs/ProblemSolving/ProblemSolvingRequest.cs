using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.ProblemSolving
{
    public class CreateProblemSolvingRequest
    {
        [Required(ErrorMessage = "Judge name is required.")]
        [MaxLength(100, ErrorMessage = "Judge name cannot exceed 100 characters.")]
        public string JudgeName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Total solved count is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Total solved must be a non-negative number.")]
        public int TotalSolved { get; set; }

        [MaxLength(50, ErrorMessage = "Rank cannot exceed 50 characters.")]
        public string? Rank { get; set; }

        [MaxLength(100, ErrorMessage = "Handle cannot exceed 100 characters.")]
        public string? Handle { get; set; }

        [Required(ErrorMessage = "Profile URL is required.")]
        [Url(ErrorMessage = "Profile URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Profile URL cannot exceed 500 characters.")]
        public string ProfileUrl { get; set; } = string.Empty;
    }

    public class UpdateProblemSolvingRequest : CreateProblemSolvingRequest { }
}
