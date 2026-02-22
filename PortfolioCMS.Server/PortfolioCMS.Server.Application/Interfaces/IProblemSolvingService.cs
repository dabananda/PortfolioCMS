using PortfolioCMS.Server.Application.DTOs.ProblemSolving;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IProblemSolvingService
    {
        Task<IReadOnlyList<ProblemSolvingResponse>> GetAllAsync();
        Task<ProblemSolvingResponse> GetByIdAsync(Guid id);
        Task<ProblemSolvingResponse> CreateAsync(CreateProblemSolvingRequest request);
        Task<ProblemSolvingResponse> UpdateAsync(Guid id, UpdateProblemSolvingRequest request);
        Task DeleteAsync(Guid id);
    }
}
