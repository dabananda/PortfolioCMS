using PortfolioCMS.Server.Application.DTOs.BlogPost;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IBlogPostService
    {
        Task<BlogPostPagedResponse> GetAllAsync(BlogPostFilterRequest filter);
        Task<BlogPostResponse> GetByIdAsync(Guid id);
        Task<BlogPostResponse> GetBySlugAsync(string slug);
        Task<BlogPostResponse> CreateAsync(CreateBlogPostRequest request);
        Task<BlogPostResponse> UpdateAsync(Guid id, UpdateBlogPostRequest request);
        Task<BlogPostResponse> PublishAsync(Guid id);
        Task<BlogPostResponse> UnpublishAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
