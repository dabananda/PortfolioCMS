using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Project : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Technologies { get; set; } = [];
        public string? GitHubUrl { get; set; }
        public string? LiveUrl { get; set; }
        public string? ImageUrl { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
