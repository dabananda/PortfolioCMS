using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Skill;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class SkillController : BaseController
    {
        private readonly ISkillService _skillService;

        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _skillService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _skillService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSkillRequest request)
        {
            var result = await _skillService.CreateAsync(request);
            return ApiCreated(result, "Skill created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateSkillRequest request)
        {
            var result = await _skillService.UpdateAsync(id, request);
            return ApiOk(result, "Skill updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _skillService.DeleteAsync(id);
            return ApiOkMessage("Skill deleted successfully.");
        }
    }
}
