using PortfolioCMS.Server.Application.DTOs.Review;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IReadOnlyList<ReviewResponse>> GetAllAsync();
        Task<ReviewResponse> GetByIdAsync(Guid id);
        Task<ReviewResponse> CreateAsync(CreateReviewRequest request);
        Task<ReviewResponse> UpdateAsync(Guid id, UpdateReviewRequest request);
        Task DeleteAsync(Guid id);
    }
}
