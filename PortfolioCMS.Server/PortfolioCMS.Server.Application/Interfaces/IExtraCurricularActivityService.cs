using PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IExtraCurricularActivityService
    {
        Task<IReadOnlyList<ExtraCurricularActivityResponse>> GetAllAsync();
        Task<ExtraCurricularActivityResponse> GetByIdAsync(Guid id);
        Task<ExtraCurricularActivityResponse> CreateAsync(CreateExtraCurricularActivityRequest request);
        Task<ExtraCurricularActivityResponse> UpdateAsync(Guid id, UpdateExtraCurricularActivityRequest request);
        Task DeleteAsync(Guid id);
    }
}
