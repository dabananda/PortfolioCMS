using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MimeKit;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEncryptionService _encryption;
        private const string CacheKey = "SystemSettings";

        public EmailService(
            ApplicationDbContext context,
            IMemoryCache cache,
            IEncryptionService encryption)
        {
            _context = context;
            _cache = cache;
            _encryption = encryption;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlMessage)
        {
            if (!_cache.TryGetValue(CacheKey, out SystemSetting? settings))
            {
                settings = await _context.SystemSettings.FirstOrDefaultAsync()
                    ?? throw new InvalidOperationException(
                        "Email settings are not configured. Please set them up in the admin panel.");

                _cache.Set(CacheKey, settings, TimeSpan.FromMinutes(10));
            }

            var smtpPassword = _encryption.Decrypt(settings!.SmtpPassEncrypted);

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(settings.SenderName, settings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new BodyBuilder { HtmlBody = htmlMessage }.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(
                    settings.SmtpHost,
                    settings.SmtpPort,
                    settings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto);

                await smtp.AuthenticateAsync(settings.SmtpUser, smtpPassword);
                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
        public void InvalidateCache() => _cache.Remove(CacheKey);
    }
}