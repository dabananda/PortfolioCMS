using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class ExtraCurricularActivityController : BaseController
    {
        private readonly IExtraCurricularActivityService _activityService;

        public ExtraCurricularActivityController(IExtraCurricularActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _activityService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _activityService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateExtraCurricularActivityRequest request)
        {
            var result = await _activityService.CreateAsync(request);
            return ApiCreated(result, "Activity created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateExtraCurricularActivityRequest request)
        {
            var result = await _activityService.UpdateAsync(id, request);
            return ApiOk(result, "Activity updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _activityService.DeleteAsync(id);
            return ApiOkMessage("Activity deleted successfully.");
        }
    }
}
