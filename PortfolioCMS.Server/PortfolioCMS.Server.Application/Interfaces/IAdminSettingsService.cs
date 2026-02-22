using PortfolioCMS.Server.Application.DTOs.Admin;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IAdminSettingsService
    {
        Task<SystemSettingResponse> GetSystemSettingAsync();
        Task<SystemSettingResponse> UpdateSystemSettingAsync(UpdateSystemSettingRequest request);
        Task<CorsSettingResponse> GetCorsSettingAsync();
        Task<CorsSettingResponse> UpdateCorsSettingAsync(UpdateCorsSettingRequest request);
    }
}
