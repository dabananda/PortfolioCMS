using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.WorkExperience;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class WorkExperienceController : BaseController
    {
        private readonly IWorkExperienceService _workExperienceService;

        public WorkExperienceController(IWorkExperienceService workExperienceService)
        {
            _workExperienceService = workExperienceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _workExperienceService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _workExperienceService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateWorkExperienceRequest request)
        {
            var result = await _workExperienceService.CreateAsync(request);
            return ApiCreated(result, "Work experience created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateWorkExperienceRequest request)
        {
            var result = await _workExperienceService.UpdateAsync(id, request);
            return ApiOk(result, "Work experience updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _workExperienceService.DeleteAsync(id);
            return ApiOkMessage("Work experience deleted successfully.");
        }
    }
}
