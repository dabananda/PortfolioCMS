using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Project : BaseEntity
    {
        public String Title { get; set; } = String.Empty;
        public String Description { get; set; } = String.Empty;
        public List<String> Technologies { get; set; } = [];
        public String? GitHubUrl { get; set; }
        public String? LiveUrl { get; set; }
        public String? ImageUrl { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
