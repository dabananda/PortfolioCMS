using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class WorkExperience : BaseEntity
    {
        public String CompanyName { get; set; } = String.Empty;
        public String? CompanyDescription { get; set;}
        public String Role { get; set; } = String.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public String? WorkDescription { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
