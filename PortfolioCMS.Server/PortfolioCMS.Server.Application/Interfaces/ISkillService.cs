using PortfolioCMS.Server.Application.DTOs.Skill;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface ISkillService
    {
        Task<IReadOnlyList<SkillResponse>> GetAllAsync();
        Task<SkillResponse> GetByIdAsync(Guid id);
        Task<SkillResponse> CreateAsync(CreateSkillRequest request);
        Task<SkillResponse> UpdateAsync(Guid id, UpdateSkillRequest request);
        Task DeleteAsync(Guid id);
    }
}
