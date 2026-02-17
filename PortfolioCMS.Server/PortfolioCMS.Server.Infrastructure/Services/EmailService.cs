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
        private const string CacheKey = "SystemSettings";

        public EmailService(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlMessage)
        {
            if (!_cache.TryGetValue(CacheKey, out SystemSetting? emailSettings))
            {
                emailSettings = await _context.SystemSettings.FirstOrDefaultAsync()
                    ?? throw new InvalidOperationException("Email settings are not configured. Please set them up in the admin panel.");

                _cache.Set(CacheKey, emailSettings, TimeSpan.FromMinutes(10));
            }

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings!.SenderName, emailSettings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlMessage };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(
                    emailSettings.SmtpHost,
                    emailSettings.SmtpPort,
                    emailSettings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto);

                await smtp.AuthenticateAsync(emailSettings.SmtpUser, emailSettings.SmtpPass);
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