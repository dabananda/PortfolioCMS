using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class Certification : BaseEntity
    {
        public string CertificationName { get; set; } = string.Empty;
        public string IssuingOrganization { get; set; } = string.Empty;
        public DateOnly DateObtained { get; set; }
        public string? CredentialId { get; set; }
        public string? CertificateUrl { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
