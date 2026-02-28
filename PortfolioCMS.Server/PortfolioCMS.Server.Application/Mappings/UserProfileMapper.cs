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
                FirstName = user.FirstName,
                LastName  = user.LastName,
                Email     = user.Email!,

                HasProfile  = true,
                Id          = entity.Id,
                UserId      = entity.UserId,
                DateOfBirth = entity.DateOfBirth,
                Status      = entity.Status,
                HeadLine    = entity.HeadLine,
                ImageUrl    = entity.ImageUrl,
                ResumeUrl   = entity.ResumeUrl,
                Location    = entity.Location,
                IsPublic    = entity.IsPublic,
                CreatedAt   = entity.CreatedAt,
                UpdatedAt   = entity.UpdatedAt,
            };
        }

        public static UserProfileResponse ToEmptyResponse(ApplicationUser user)
        {
            ArgumentNullException.ThrowIfNull(user);

            return new UserProfileResponse
            {
                FirstName  = user.FirstName,
                LastName   = user.LastName,
                Email      = user.Email!,
                HasProfile = false,
            };
        }

        public static UserProfile ToEntity(CreateUserProfileRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new UserProfile
            {
                UserId      = userId,
                DateOfBirth = request.DateOfBirth,
                Status      = request.Status,
                HeadLine    = request.HeadLine.Trim(),
                ImageUrl    = request.ImageUrl?.Trim(),
                ResumeUrl   = request.ResumeUrl?.Trim(),
                Location    = request.Location?.Trim(),
                IsPublic    = request.IsPublic,
            };
        }

        public static void ApplyUpdate(UpdateUserProfileRequest request, UserProfile entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.DateOfBirth = request.DateOfBirth;
            entity.Status      = request.Status;
            entity.HeadLine    = request.HeadLine.Trim();
            entity.ImageUrl    = request.ImageUrl?.Trim();
            entity.ResumeUrl   = request.ResumeUrl?.Trim();
            entity.Location    = request.Location?.Trim();
            entity.IsPublic    = request.IsPublic;
        }
    }
}