using PortfolioCMS.Server.Application.DTOs.WorkExperience;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class WorkExperienceMapper
    {
        public static WorkExperienceResponse ToResponse(WorkExperience entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new WorkExperienceResponse
            {
                Id = entity.Id,
                CompanyName = entity.CompanyName,
                CompanyDescription = entity.CompanyDescription,
                Role = entity.Role,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                WorkDescription = entity.WorkDescription,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<WorkExperienceResponse> ToResponseList(IEnumerable<WorkExperience> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static WorkExperience ToEntity(CreateWorkExperienceRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new WorkExperience
            {
                CompanyName = request.CompanyName.Trim(),
                CompanyDescription = request.CompanyDescription?.Trim(),
                Role = request.Role.Trim(),
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                WorkDescription = request.WorkDescription?.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateWorkExperienceRequest request, WorkExperience entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.CompanyName = request.CompanyName.Trim();
            entity.CompanyDescription = request.CompanyDescription?.Trim();
            entity.Role = request.Role.Trim();
            entity.StartDate = request.StartDate;
            entity.EndDate = request.EndDate;
            entity.WorkDescription = request.WorkDescription?.Trim();
        }
    }
}
