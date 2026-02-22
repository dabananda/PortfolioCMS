using PortfolioCMS.Server.Application.DTOs.Skill;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class SkillMapper
    {
        public static SkillResponse ToResponse(Skill entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new SkillResponse
            {
                Id = entity.Id,
                SkillName = entity.SkillName,
                Category = entity.Category,
                Proficiency = entity.Proficiency,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<SkillResponse> ToResponseList(IEnumerable<Skill> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static Skill ToEntity(CreateSkillRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new Skill
            {
                SkillName = request.SkillName.Trim(),
                Category = request.Category?.Trim(),
                Proficiency = request.Proficiency,
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateSkillRequest request, Skill entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.SkillName = request.SkillName.Trim();
            entity.Category = request.Category?.Trim();
            entity.Proficiency = request.Proficiency;
        }
    }
}
