using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PortfolioCMS.Server.Application.DTOs.ContactMessage;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [Route("api/v1/portfolio/{username}/contact-message")]
    [ApiController]
    public class PortfolioContactController : ControllerBase
    {
        private readonly IContactMessageService _contactMessageService;

        public PortfolioContactController(IContactMessageService contactMessageService)
        {
            _contactMessageService = contactMessageService;
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromRoute] string username, [FromBody] SendContactMessageRequest request)
        {
            await _contactMessageService.SendAsync(username, request);
            return Ok("Your message has been sent successfully.");
        }
    }

    [EnableRateLimiting("api")]
    public class ContactMessageController : BaseController
    {
        private readonly IContactMessageService _contactMessageService;

        public ContactMessageController(IContactMessageService contactMessageService)
        {
            _contactMessageService = contactMessageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ContactMessageFilterRequest filter)
        {
            var result = await _contactMessageService.GetAllAsync(filter);
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _contactMessageService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPatch("{id:guid}/mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromRoute] Guid id)
        {
            var result = await _contactMessageService.MarkAsReadAsync(id);
            return ApiOk(result, "Message marked as read.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _contactMessageService.DeleteAsync(id);
            return ApiOkMessage("Message deleted successfully.");
        }
    }
}
