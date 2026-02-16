using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class BlogPost : BaseEntity
    {
        public String Title { get; set; } = String.Empty;
        public String Post { get; set; } = String.Empty;
        public String? ImageUrl { get; set; } = String.Empty;
        public BlogPostCategory BlogPostCategory { get; set; } = new BlogPostCategory();
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
