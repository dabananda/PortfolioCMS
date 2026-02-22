using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Admin;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class AdminSettingsService : IAdminSettingsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEncryptionService _encryption;
        private readonly EmailService _emailService;

        public AdminSettingsService(
            ApplicationDbContext context,
            IEncryptionService encryption,
            IEmailService emailService)
        {
            _context = context;
            _encryption = encryption;
            _emailService = (EmailService)emailService;
        }

        public async Task<SystemSettingResponse> GetSystemSettingAsync()
        {
            var setting = await _context.SystemSettings.AsNoTracking().FirstOrDefaultAsync()
                ?? throw new AppNotFoundException("System settings have not been configured yet.");

            return MapToSystemSettingResponse(setting);
        }

        public async Task<SystemSettingResponse> UpdateSystemSettingAsync(UpdateSystemSettingRequest request)
        {
            var setting = await _context.SystemSettings.FirstOrDefaultAsync()
                ?? throw new AppNotFoundException("System settings have not been configured yet.");

            setting.SmtpHost = request.SmtpHost.Trim();
            setting.SmtpPort = request.SmtpPort;
            setting.SmtpUser = request.SmtpUser.Trim();
            setting.SenderName = request.SenderName.Trim();
            setting.SenderEmail = request.SenderEmail.Trim().ToLowerInvariant();
            setting.EnableSsl = request.EnableSsl;

            // Only update the password if a new one was supplied
            if (!string.IsNullOrWhiteSpace(request.SmtpPassword))
                setting.SmtpPassEncrypted = _encryption.Encrypt(request.SmtpPassword);

            await _context.SaveChangesAsync();

            // Invalidate the in-memory cache so the next email picks up the new settings
            _emailService.InvalidateCache();

            return MapToSystemSettingResponse(setting);
        }

        public async Task<CorsSettingResponse> GetCorsSettingAsync()
        {
            var setting = await _context.CorsSettings.AsNoTracking().FirstOrDefaultAsync()
                ?? throw new AppNotFoundException("CORS settings have not been configured yet.");

            return MapToCorsSettingResponse(setting);
        }

        public async Task<CorsSettingResponse> UpdateCorsSettingAsync(UpdateCorsSettingRequest request)
        {
            var setting = await _context.CorsSettings.FirstOrDefaultAsync()
                ?? throw new AppNotFoundException("CORS settings have not been configured yet.");

            // Trim and remove blank/duplicate entries
            var origins = request.AllowedOrigins
                .Select(o => o.Trim())
                .Where(o => !string.IsNullOrEmpty(o))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (origins.Count == 0)
                throw new AppValidationException("At least one valid allowed origin is required.");

            setting.AllowedOrigins = string.Join(",", origins);

            await _context.SaveChangesAsync();

            return MapToCorsSettingResponse(setting);
        }

        // Helpers
        private static SystemSettingResponse MapToSystemSettingResponse(Domain.Entities.SystemSetting s) =>
            new()
            {
                Id = s.Id,
                SmtpHost = s.SmtpHost,
                SmtpPort = s.SmtpPort,
                SmtpUser = s.SmtpUser,
                SenderName = s.SenderName,
                SenderEmail = s.SenderEmail,
                EnableSsl = s.EnableSsl,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            };

        private static CorsSettingResponse MapToCorsSettingResponse(Domain.Entities.CorsSetting s) =>
            new()
            {
                Id = s.Id,
                AllowedOrigins = s.AllowedOrigins
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList(),
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            };
    }
}
