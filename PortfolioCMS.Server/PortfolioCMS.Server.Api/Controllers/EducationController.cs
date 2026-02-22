using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Education;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class EducationController : BaseController
    {
        private readonly IEducationService _educationService;

        public EducationController(IEducationService educationService)
        {
            _educationService = educationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _educationService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _educationService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEducationRequest request)
        {
            var result = await _educationService.CreateAsync(request);
            return ApiCreated(result, "Education record created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateEducationRequest request)
        {
            var result = await _educationService.UpdateAsync(id, request);
            return ApiOk(result, "Education record updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _educationService.DeleteAsync(id);
            return ApiOkMessage("Education record deleted successfully.");
        }
    }
}
