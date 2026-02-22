using PortfolioCMS.Server.Application.DTOs.Project;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IProjectService
    {
        Task<IReadOnlyList<ProjectResponse>> GetProjectsAsync();
        Task<ProjectResponse> GetProjectByIdAsync(Guid id);
        Task<ProjectResponse> CreateProjectAsync(CreateProjectRequest request);
        Task<ProjectResponse> UpdateProjectAsync(Guid id, UpdateProjectRequest request);
        Task DeleteProjectAsync(Guid id);
    }
}
