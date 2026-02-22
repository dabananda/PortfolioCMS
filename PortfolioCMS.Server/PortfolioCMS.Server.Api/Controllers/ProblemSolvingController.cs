using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.ProblemSolving;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class ProblemSolvingController : BaseController
    {
        private readonly IProblemSolvingService _problemSolvingService;

        public ProblemSolvingController(IProblemSolvingService problemSolvingService)
        {
            _problemSolvingService = problemSolvingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _problemSolvingService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _problemSolvingService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProblemSolvingRequest request)
        {
            var result = await _problemSolvingService.CreateAsync(request);
            return ApiCreated(result, "Problem solving record created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateProblemSolvingRequest request)
        {
            var result = await _problemSolvingService.UpdateAsync(id, request);
            return ApiOk(result, "Problem solving record updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _problemSolvingService.DeleteAsync(id);
            return ApiOkMessage("Problem solving record deleted successfully.");
        }
    }
}
