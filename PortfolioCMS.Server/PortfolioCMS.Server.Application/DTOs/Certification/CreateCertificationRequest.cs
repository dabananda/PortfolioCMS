using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.Certification
{
    public class CreateCertificationRequest
    {
        [Required(ErrorMessage = "Certification name is required.")]
        [MaxLength(200, ErrorMessage = "Certification name cannot exceed 200 characters.")]
        public string CertificationName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Issuing organization is required.")]
        [MaxLength(200, ErrorMessage = "Issuing organization cannot exceed 200 characters.")]
        public string IssuingOrganization { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date obtained is required.")]
        public DateOnly DateObtained { get; set; }

        [MaxLength(100, ErrorMessage = "Credential ID cannot exceed 100 characters.")]
        public string? CredentialId { get; set; }

        [Url(ErrorMessage = "Certificate URL must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Certificate URL cannot exceed 500 characters.")]
        public string? CertificateUrl { get; set; }
    }
}
