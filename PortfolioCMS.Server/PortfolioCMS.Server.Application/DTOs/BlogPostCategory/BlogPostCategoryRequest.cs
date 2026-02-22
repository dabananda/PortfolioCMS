using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.BlogPostCategory
{
    public class CreateBlogPostCategoryRequest
    {
        [Required(ErrorMessage = "Category name is required.")]
        [MaxLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }
    }

    public class UpdateBlogPostCategoryRequest : CreateBlogPostCategoryRequest { }
}
