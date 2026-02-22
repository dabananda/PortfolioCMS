using PortfolioCMS.Server.Application.DTOs.SocialLink;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class SocialLinkMapper
    {
        public static SocialLinkResponse ToResponse(SocialLink entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new SocialLinkResponse
            {
                Id = entity.Id,
                Name = entity.Name,
                Link = entity.Link,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<SocialLinkResponse> ToResponseList(IEnumerable<SocialLink> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static SocialLink ToEntity(CreateSocialLinkRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new SocialLink
            {
                Name = request.Name.Trim(),
                Link = request.Link.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateSocialLinkRequest request, SocialLink entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Name = request.Name.Trim();
            entity.Link = request.Link.Trim();
        }
    }
}
