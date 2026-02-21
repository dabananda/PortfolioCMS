namespace PortfolioCMS.Server.Application.DTOs.Certification
{
    public class CertificationResponse
    {
        public Guid Id { get; set; }
        public string CertificationName { get; set; } = string.Empty;
        public string IssuingOrganization { get; set; } = string.Empty;
        public DateOnly DateObtained { get; set; }
        public string? CredentialId { get; set; }
        public string? CertificateUrl { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
