using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Admin;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Api.Controllers
{
    [Authorize(Roles = Role.Admin)]
    public class AdminSettingsController : BaseController
    {
        private readonly IAdminSettingsService _adminSettingsService;

        public AdminSettingsController(IAdminSettingsService adminSettingsService)
        {
            _adminSettingsService = adminSettingsService;
        }

        [HttpGet("system")]
        public async Task<IActionResult> GetSystemSetting()
        {
            var result = await _adminSettingsService.GetSystemSettingAsync();
            return ApiOk(result);
        }

        [HttpPut("system")]
        public async Task<IActionResult> UpdateSystemSetting([FromBody] UpdateSystemSettingRequest request)
        {
            var result = await _adminSettingsService.UpdateSystemSettingAsync(request);
            return ApiOk(result, "System settings updated successfully.");
        }

        [HttpGet("cors")]
        public async Task<IActionResult> GetCorsSetting()
        {
            var result = await _adminSettingsService.GetCorsSettingAsync();
            return ApiOk(result);
        }

        [HttpPut("cors")]
        public async Task<IActionResult> UpdateCorsSetting([FromBody] UpdateCorsSettingRequest request)
        {
            var result = await _adminSettingsService.UpdateCorsSettingAsync(request);
            return ApiOk(result, "CORS settings updated successfully.");
        }
    }
}
