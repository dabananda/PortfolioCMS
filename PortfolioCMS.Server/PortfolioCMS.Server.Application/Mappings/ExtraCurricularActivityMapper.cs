using PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class ExtraCurricularActivityMapper
    {
        public static ExtraCurricularActivityResponse ToResponse(ExtraCurricularActivity entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new ExtraCurricularActivityResponse
            {
                Id = entity.Id,
                Title = entity.Title,
                Organization = entity.Organization,
                Description = entity.Description,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<ExtraCurricularActivityResponse> ToResponseList(IEnumerable<ExtraCurricularActivity> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static ExtraCurricularActivity ToEntity(CreateExtraCurricularActivityRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new ExtraCurricularActivity
            {
                Title = request.Title.Trim(),
                Organization = request.Organization.Trim(),
                Description = request.Description.Trim(),
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateExtraCurricularActivityRequest request, ExtraCurricularActivity entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Title = request.Title.Trim();
            entity.Organization = request.Organization.Trim();
            entity.Description = request.Description.Trim();
            entity.StartDate = request.StartDate;
            entity.EndDate = request.EndDate;
        }
    }
}
