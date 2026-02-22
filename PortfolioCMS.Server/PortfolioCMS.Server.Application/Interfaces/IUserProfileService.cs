using PortfolioCMS.Server.Application.DTOs.UserProfile;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IUserProfileService
    {
        Task<UserProfileResponse?> GetMyProfileAsync();
        Task<UserProfileResponse> CreateAsync(CreateUserProfileRequest request);
        Task<UserProfileResponse> UpdateAsync(UpdateUserProfileRequest request);
    }
}
