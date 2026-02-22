using PortfolioCMS.Server.Application.DTOs.Education;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IEducationService
    {
        Task<IReadOnlyList<EducationResponse>> GetAllAsync();
        Task<EducationResponse> GetByIdAsync(Guid id);
        Task<EducationResponse> CreateAsync(CreateEducationRequest request);
        Task<EducationResponse> UpdateAsync(Guid id, UpdateEducationRequest request);
        Task DeleteAsync(Guid id);
    }
}
