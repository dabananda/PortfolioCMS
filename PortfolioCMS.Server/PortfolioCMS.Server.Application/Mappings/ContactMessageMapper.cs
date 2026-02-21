using PortfolioCMS.Server.Application.DTOs.ContactMessage;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class ContactMessageMapper
    {
        public static ContactMessageResponse ToResponse(ContactMessage entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new ContactMessageResponse
            {
                Id = entity.Id,
                FullName = entity.FullName,
                Email = entity.Email,
                Subject = entity.Subject,
                Description = entity.Description,
                CreatedAt = entity.CreatedAt,
                IsRead = entity.IsRead,
                ReadAt = entity.ReadAt
            };
        }

        public static IReadOnlyList<ContactMessageResponse> ToResponseList(IEnumerable<ContactMessage> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);

            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static ContactMessagePagedResponse ToPagedResponse(IEnumerable<ContactMessage> pageItems, int totalCount, int unreadCount, int page, int pageSize)
        {
            return new ContactMessagePagedResponse
            {
                Items = ToResponseList(pageItems),
                TotalCount = totalCount,
                UnreadCount = unreadCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public static ContactMessage ToEntity(SendContactMessageRequest request, Guid targetUserId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new ContactMessage
            {
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                Subject = request.Subject.Trim(),
                Description = request.Description.Trim(),
                IsRead = false,
                ReadAt = null,
                UserId = targetUserId
            };
        }
    }
}
