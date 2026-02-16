using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Education : BaseEntity
    {
        public String InstituteName { get; set; } = String.Empty;
        public String Department { get; set; } = String.Empty;
        public String CGPA { get; set; } = String.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public String InstituteLocation { get; set; } = String.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
