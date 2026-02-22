using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class BlogPostController : BaseController
    {
        private readonly IBlogPostService _blogPostService;

        public BlogPostController(IBlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] BlogPostFilterRequest filter)
        {
            var result = await _blogPostService.GetAllAsync(filter);
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _blogPostService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug([FromRoute] string slug)
        {
            var result = await _blogPostService.GetBySlugAsync(slug);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBlogPostRequest request)
        {
            var result = await _blogPostService.CreateAsync(request);
            return ApiCreated(result, "Blog post created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateBlogPostRequest request)
        {
            var result = await _blogPostService.UpdateAsync(id, request);
            return ApiOk(result, "Blog post updated successfully.");
        }

        [HttpPatch("{id:guid}/publish")]
        public async Task<IActionResult> Publish([FromRoute] Guid id)
        {
            var result = await _blogPostService.PublishAsync(id);
            return ApiOk(result, "Blog post published successfully.");
        }

        [HttpPatch("{id:guid}/unpublish")]
        public async Task<IActionResult> Unpublish([FromRoute] Guid id)
        {
            var result = await _blogPostService.UnpublishAsync(id);
            return ApiOk(result, "Blog post unpublished successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _blogPostService.DeleteAsync(id);
            return ApiOkMessage("Blog post deleted successfully.");
        }
    }
}
