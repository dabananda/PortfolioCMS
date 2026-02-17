using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Review : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
