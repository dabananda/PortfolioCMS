using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.BlogPostCategory;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class BlogPostCategoryController : BaseController
    {
        private readonly IBlogPostCategoryService _blogPostCategoryService;

        public BlogPostCategoryController(IBlogPostCategoryService blogPostCategoryService)
        {
            _blogPostCategoryService = blogPostCategoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _blogPostCategoryService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _blogPostCategoryService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBlogPostCategoryRequest request)
        {
            var result = await _blogPostCategoryService.CreateAsync(request);
            return ApiCreated(result, "Blog post category created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateBlogPostCategoryRequest request)
        {
            var result = await _blogPostCategoryService.UpdateAsync(id, request);
            return ApiOk(result, "Blog post category updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _blogPostCategoryService.DeleteAsync(id);
            return ApiOkMessage("Blog post category deleted successfully.");
        }
    }
}
