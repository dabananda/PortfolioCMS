using PortfolioCMS.Server.Application.DTOs.WorkExperience;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IWorkExperienceService
    {
        Task<IReadOnlyList<WorkExperienceResponse>> GetAllAsync();
        Task<WorkExperienceResponse> GetByIdAsync(Guid id);
        Task<WorkExperienceResponse> CreateAsync(CreateWorkExperienceRequest request);
        Task<WorkExperienceResponse> UpdateAsync(Guid id, UpdateWorkExperienceRequest request);
        Task DeleteAsync(Guid id);
    }
}
