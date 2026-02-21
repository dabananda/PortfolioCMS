using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.ContactMessage;
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

        public ContactMessageService(
            ApplicationDbContext context,
            ICurrentUserService currentUserService,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedMessageAsync(id);

            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        public async Task<ContactMessagePagedResponse> GetAllAsync(ContactMessageFilterRequest filter)
        {
            var userId = GetAuthenticatedUserId();

            var page = Math.Max(1, filter.Page);
            var pageSize = Math.Clamp(filter.PageSize, 1, 100);

            var query = _context.ContactMessages.AsNoTracking().Where(m => m.UserId == userId);

            // read/unread filter
            if (filter.IsRead.HasValue)
                query = query.Where(m => m.IsRead == filter.IsRead.Value);

            var totalCount = await query.CountAsync();
            var unreadCount = await _context.ContactMessages.AsNoTracking().CountAsync(m => m.UserId == userId && !m.IsRead);

            var pageItems = await query.OrderByDescending(m => m.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

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
            var owner = await _userManager.FindByNameAsync(targetUsername) ?? throw new AppNotFoundException($"Portfolio '{targetUsername}' was not found.");

            var entity = ContactMessageMapper.ToEntity(request, owner.Id);

            await _context.ContactMessages.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        // Helper methods
        private Guid GetAuthenticatedUserId()
        {
            if (!_currentUserService.IsAuthenticated || _currentUserService.UserId is null)
                throw new AppUnauthorizedException("User is not authenticated.");

            return _currentUserService.UserId.Value;
        }

        private async Task<ContactMessage> FindOwnedMessageAsync(Guid id)
        {
            var userId = GetAuthenticatedUserId();

            return await _context.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId) ?? throw new AppNotFoundException($"Contact message with ID '{id}' was not found.");
        }
    }
}
