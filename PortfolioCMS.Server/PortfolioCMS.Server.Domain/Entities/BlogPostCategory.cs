using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class BlogPostCategory : BaseEntity
    {
        public String Name { get; set; } = String.Empty;
        public String? Description { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
