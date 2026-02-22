using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.ContactMessage;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class ContactMessageService : IContactMessageService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public ContactMessageService(
            ApplicationDbContext context,
            ICurrentUserService currentUserService,
            UserManager<ApplicationUser> userManager,
            IEmailService emailService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedMessageAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        public async Task<ContactMessagePagedResponse> GetAllAsync(ContactMessageFilterRequest filter)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var page = Math.Max(1, filter.Page);
            var pageSize = Math.Clamp(filter.PageSize, 1, 100);

            var query = _context.ContactMessages.AsNoTracking().Where(m => m.UserId == userId);

            if (filter.IsRead.HasValue)
                query = query.Where(m => m.IsRead == filter.IsRead.Value);

            var totalCount = await query.CountAsync();
            var unreadCount = await _context.ContactMessages
                .AsNoTracking()
                .CountAsync(m => m.UserId == userId && !m.IsRead);

            var pageItems = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return ContactMessageMapper.ToPagedResponse(pageItems, totalCount, unreadCount, page, pageSize);
        }

        public async Task<ContactMessageResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedMessageAsync(id);
            return ContactMessageMapper.ToResponse(entity);
        }

        public async Task<ContactMessageResponse> MarkAsReadAsync(Guid id)
        {
            var entity = await FindOwnedMessageAsync(id);

            if (!entity.IsRead)
            {
                entity.IsRead = true;
                entity.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return ContactMessageMapper.ToResponse(entity);
        }

        public async Task SendAsync(string targetUsername, SendContactMessageRequest request)
        {
            var owner = await _userManager.FindByNameAsync(targetUsername)
                ?? throw new AppNotFoundException($"Portfolio '{targetUsername}' was not found.");

            var entity = ContactMessageMapper.ToEntity(request, owner.Id);
            await _context.ContactMessages.AddAsync(entity);
            await _context.SaveChangesAsync();

            // Fire-and-forget email notification — never fails the caller
            _ = NotifyOwnerAsync(owner, request);
        }

        // Helpers
        private async Task NotifyOwnerAsync(ApplicationUser owner, SendContactMessageRequest request)
        {
            try
            {
                var htmlBody = $"""
                    <h2>You have a new contact message on your portfolio!</h2>
                    <table style="border-collapse:collapse;font-family:sans-serif;">
                      <tr><td style="padding:6px;font-weight:bold;">From</td>
                          <td style="padding:6px;">{System.Net.WebUtility.HtmlEncode(request.FullName)}</td></tr>
                      <tr><td style="padding:6px;font-weight:bold;">Email</td>
                          <td style="padding:6px;">{System.Net.WebUtility.HtmlEncode(request.Email)}</td></tr>
                      <tr><td style="padding:6px;font-weight:bold;">Subject</td>
                          <td style="padding:6px;">{System.Net.WebUtility.HtmlEncode(request.Subject)}</td></tr>
                      <tr><td style="padding:6px;font-weight:bold;vertical-align:top;">Message</td>
                          <td style="padding:6px;white-space:pre-wrap;">{System.Net.WebUtility.HtmlEncode(request.Description)}</td></tr>
                    </table>
                    <p style="color:#888;font-size:12px;">Log in to your portfolio dashboard to manage this message.</p>
                    """;

                await _emailService.SendEmailAsync(
                    owner.Email!,
                    $"New contact message from {request.FullName}: {request.Subject}",
                    htmlBody);
            }
            catch
            {
                // Email failure must never surface to the visitor.
                // The message is already persisted in the DB.
            }
        }

        private async Task<ContactMessage> FindOwnedMessageAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.ContactMessages
                .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId)
                ?? throw new AppNotFoundException($"Contact message with ID '{id}' was not found.");
        }
    }
}