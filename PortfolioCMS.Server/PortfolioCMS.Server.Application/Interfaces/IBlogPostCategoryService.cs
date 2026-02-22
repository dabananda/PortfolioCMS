using PortfolioCMS.Server.Application.DTOs.BlogPostCategory;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IBlogPostCategoryService
    {
        Task<IReadOnlyList<BlogPostCategoryResponse>> GetAllAsync();
        Task<BlogPostCategoryResponse> GetByIdAsync(Guid id);
        Task<BlogPostCategoryResponse> CreateAsync(CreateBlogPostCategoryRequest request);
        Task<BlogPostCategoryResponse> UpdateAsync(Guid id, UpdateBlogPostCategoryRequest request);
        Task DeleteAsync(Guid id);
    }
}
