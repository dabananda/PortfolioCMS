using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.BlogPost
{
    public class CreateBlogPostRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Summary cannot exceed 500 characters.")]
        public string? Summary { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        public string Content { get; set; } = string.Empty;

        [Url(ErrorMessage = "Image URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Image URL cannot exceed 500 characters.")]
        public string? ImageUrl { get; set; }

        [Required(ErrorMessage = "Category ID is required.")]
        public Guid BlogPostCategoryId { get; set; }
    }

    public class UpdateBlogPostRequest : CreateBlogPostRequest { }

    public class BlogPostFilterRequest
    {
        public bool? IsPublished { get; set; }
        public Guid? CategoryId { get; set; }
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
