using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.SocialLink;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class SocialLinkController : BaseController
    {
        private readonly ISocialLinkService _socialLinkService;

        public SocialLinkController(ISocialLinkService socialLinkService)
        {
            _socialLinkService = socialLinkService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _socialLinkService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _socialLinkService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSocialLinkRequest request)
        {
            var result = await _socialLinkService.CreateAsync(request);
            return ApiCreated(result, "Social link created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateSocialLinkRequest request)
        {
            var result = await _socialLinkService.UpdateAsync(id, request);
            return ApiOk(result, "Social link updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _socialLinkService.DeleteAsync(id);
            return ApiOkMessage("Social link deleted successfully.");
        }
    }
}
