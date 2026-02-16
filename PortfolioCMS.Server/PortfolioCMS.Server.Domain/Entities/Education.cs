using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Education : BaseEntity
    {
        public string InstituteName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal CGPA { get; set; }
        public decimal Scale { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string InstituteLocation { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
