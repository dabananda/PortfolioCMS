using PortfolioCMS.Server.Application.DTOs.Education;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class EducationMapper
    {
        public static EducationResponse ToResponse(Education entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new EducationResponse
            {
                Id = entity.Id,
                InstituteName = entity.InstituteName,
                Department = entity.Department,
                CGPA = entity.CGPA,
                Scale = entity.Scale,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                InstituteLocation = entity.InstituteLocation,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<EducationResponse> ToResponseList(IEnumerable<Education> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static Education ToEntity(CreateEducationRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new Education
            {
                InstituteName = request.InstituteName.Trim(),
                Department = request.Department.Trim(),
                CGPA = request.CGPA,
                Scale = request.Scale,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                InstituteLocation = request.InstituteLocation.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateEducationRequest request, Education entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.InstituteName = request.InstituteName.Trim();
            entity.Department = request.Department.Trim();
            entity.CGPA = request.CGPA;
            entity.Scale = request.Scale;
            entity.StartDate = request.StartDate;
            entity.EndDate = request.EndDate;
            entity.InstituteLocation = request.InstituteLocation.Trim();
        }
    }
}
