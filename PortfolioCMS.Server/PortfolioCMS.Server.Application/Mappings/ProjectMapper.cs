using PortfolioCMS.Server.Application.DTOs.Project;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class ProjectMapper
    {
        public static ProjectResponse ToResponse(Project entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new ProjectResponse
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Technologies = entity.Technologies,
                GitHubUrl = entity.GitHubUrl,
                LiveUrl = entity.LiveUrl,
                ImageUrl = entity.ImageUrl,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<ProjectResponse> ToResponseList(IEnumerable<Project> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static Project ToEntity(CreateProjectRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);
            
            return new Project
            {
                Title = request.Title,
                Description = request.Description,
                Technologies = request.Technologies,
                GitHubUrl = request.GitHubUrl,
                LiveUrl = request.LiveUrl,
                ImageUrl = request.ImageUrl,
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateProjectRequest request, Project entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Title = request.Title.Trim();
            entity.Description = request.Description.Trim();
            entity.Technologies = request.Technologies.Select(t => t.Trim()).ToList();
            entity.GitHubUrl = request.GitHubUrl?.Trim();
            entity.LiveUrl = request.LiveUrl?.Trim();
            entity.ImageUrl = request.ImageUrl?.Trim();
        }
    }
}
