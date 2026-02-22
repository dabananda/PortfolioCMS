using PortfolioCMS.Server.Application.DTOs.UserProfile;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class UserProfileMapper
    {
        public static UserProfileResponse ToResponse(UserProfile entity, ApplicationUser user)
        {
            ArgumentNullException.ThrowIfNull(entity);
            ArgumentNullException.ThrowIfNull(user);

            return new UserProfileResponse
            {
                Id = entity.Id,
                UserId = entity.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                DateOfBirth = entity.DateOfBirth,
                Status = entity.Status,
                HeadLine = entity.HeadLine,
                ImageUrl = entity.ImageUrl,
                ResumeUrl = entity.ResumeUrl,
                Location = entity.Location,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static UserProfile ToEntity(CreateUserProfileRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new UserProfile
            {
                UserId = userId,
                DateOfBirth = request.DateOfBirth,
                Status = request.Status,
                HeadLine = request.HeadLine.Trim(),
                ImageUrl = request.ImageUrl?.Trim(),
                ResumeUrl = request.ResumeUrl?.Trim(),
                Location = request.Location?.Trim()
            };
        }

        public static void ApplyUpdate(UpdateUserProfileRequest request, UserProfile entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.DateOfBirth = request.DateOfBirth;
            entity.Status = request.Status;
            entity.HeadLine = request.HeadLine.Trim();
            entity.ImageUrl = request.ImageUrl?.Trim();
            entity.ResumeUrl = request.ResumeUrl?.Trim();
            entity.Location = request.Location?.Trim();
        }
    }
}
