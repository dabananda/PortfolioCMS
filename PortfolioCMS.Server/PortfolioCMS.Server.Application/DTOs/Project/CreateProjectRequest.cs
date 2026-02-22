using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Project
{
    public class CreateProjectRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one technology must be specified.")]
        [MinLength(1, ErrorMessage = "At least one technology must be specified.")]
        public List<string> Technologies { get; set; } = [];

        [Url(ErrorMessage = "GitHub URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "GitHub URL cannot exceed 500 characters.")]
        public string? GitHubUrl { get; set; }

        [Url(ErrorMessage = "Live URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Live URL cannot exceed 500 characters.")]
        public string? LiveUrl { get; set; }

        [Url(ErrorMessage = "Image URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }
    }
}
