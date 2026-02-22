using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.DTOs.Common;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    [AllowAnonymous]
    [EnableRateLimiting("api")]
    [Route("api/v1/portfolio/{username}")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;

        public PortfolioController(IPortfolioService portfolioService)
        {
            _portfolioService = portfolioService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPortfolio([FromRoute] string username)
        {
            var result = await _portfolioService.GetPortfolioAsync(username);
            return Ok(ApiResponse<object>.Ok(result));
        }

        [HttpGet("blog")]
        public async Task<IActionResult> GetBlogPosts(
            [FromRoute] string username,
            [FromQuery] BlogPostFilterRequest filter)
        {
            var result = await _portfolioService.GetPublishedBlogPostsAsync(username, filter);
            return Ok(ApiResponse<object>.Ok(result));
        }

        [HttpGet("blog/{slug}")]
        public async Task<IActionResult> GetBlogPost(
            [FromRoute] string username,
            [FromRoute] string slug)
        {
            var result = await _portfolioService.GetPublishedBlogPostBySlugAsync(username, slug);
            return Ok(ApiResponse<object>.Ok(result));
        }
    }
}
