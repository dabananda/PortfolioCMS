using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.DTOs.Portfolio;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IPortfolioService
    {
        Task<PublicPortfolioResponse> GetPortfolioAsync(string username);
        Task<BlogPostPagedResponse> GetPublishedBlogPostsAsync(string username, BlogPostFilterRequest filter);
        Task<BlogPostResponse> GetPublishedBlogPostBySlugAsync(string username, string slug);
    }
}
