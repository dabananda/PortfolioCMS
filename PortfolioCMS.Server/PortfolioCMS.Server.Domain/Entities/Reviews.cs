using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Reviews : BaseEntity
    {
        public String Name { get; set; } = String.Empty;
        public String Review { get; set; } = String.Empty;
        public String? Designation { get; set; }
        public double Rating { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
