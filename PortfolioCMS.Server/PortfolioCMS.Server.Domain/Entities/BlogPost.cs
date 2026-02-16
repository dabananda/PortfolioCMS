using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class BlogPost : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Post { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Guid BlogPostCategoryId { get; set; }
        public BlogPostCategory? BlogPostCategory { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
