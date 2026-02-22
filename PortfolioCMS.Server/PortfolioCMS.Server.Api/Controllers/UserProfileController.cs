using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.UserProfile;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class UserProfileController : BaseController
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _userProfileService.GetMyProfileAsync();
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserProfileRequest request)
        {
            var result = await _userProfileService.CreateAsync(request);
            return ApiCreated(result, "Profile created successfully.");
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserProfileRequest request)
        {
            var result = await _userProfileService.UpdateAsync(request);
            return ApiOk(result, "Profile updated successfully.");
        }
    }
}
