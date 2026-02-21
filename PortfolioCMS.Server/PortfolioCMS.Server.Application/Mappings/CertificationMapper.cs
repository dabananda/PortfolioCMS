using PortfolioCMS.Server.Application.DTOs.Certification;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class CertificationMapper
    {
        public static CertificationResponse ToResponse(Certification entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new CertificationResponse
            {
                Id = entity.Id,
                CertificationName = entity.CertificationName,
                IssuingOrganization = entity.IssuingOrganization,
                DateObtained = entity.DateObtained,
                CredentialId = entity.CredentialId,
                CertificateUrl = entity.CertificateUrl,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<CertificationResponse> ToResponseList(IEnumerable<Certification> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);

            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static Certification ToEntity(CreateCertificationRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new Certification
            {
                CertificationName = request.CertificationName.Trim(),
                IssuingOrganization = request.IssuingOrganization.Trim(),
                DateObtained = request.DateObtained,
                CredentialId = request.CredentialId?.Trim(),
                CertificateUrl = request.CertificateUrl?.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateCertificationRequest request, Certification entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.CertificationName = request.CertificationName.Trim();
            entity.IssuingOrganization = request.IssuingOrganization.Trim();
            entity.DateObtained = request.DateObtained;
            entity.CredentialId = request.CredentialId?.Trim();
            entity.CertificateUrl = request.CertificateUrl?.Trim();
        }
    }
}
