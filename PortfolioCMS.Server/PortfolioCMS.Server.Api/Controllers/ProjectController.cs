using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Project;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class ProjectController : BaseController
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _projectService.GetProjectsAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _projectService.GetProjectByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
        {
            var result = await _projectService.CreateProjectAsync(request);
            return ApiCreated(result, "Project created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateProjectRequest request)
        {
            var result = await _projectService.UpdateProjectAsync(id, request);
            return ApiOk(result, "Project updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _projectService.DeleteProjectAsync(id);
            return ApiOkMessage("Project deleted successfully.");
        }
    }
}
