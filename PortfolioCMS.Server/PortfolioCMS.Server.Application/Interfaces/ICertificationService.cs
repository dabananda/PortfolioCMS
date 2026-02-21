using PortfolioCMS.Server.Application.DTOs.Certification;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface ICertificationService
    {
        Task<IReadOnlyList<CertificationResponse>> GetAllAsync();
        Task<CertificationResponse> GetByIdAsync(Guid id);
        Task<CertificationResponse> CreateAsync(CreateCertificationRequest request);
        Task<CertificationResponse> UpdateAsync(Guid id, UpdateCertificationRequest request);
        Task DeleteAsync(Guid id);
    }
}
