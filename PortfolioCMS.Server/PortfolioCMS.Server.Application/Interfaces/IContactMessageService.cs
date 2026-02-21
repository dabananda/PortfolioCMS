using PortfolioCMS.Server.Application.DTOs.ContactMessage;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IContactMessageService
    {
        Task SendAsync(string targetUsername, SendContactMessageRequest request);
        Task<ContactMessagePagedResponse> GetAllAsync(ContactMessageFilterRequest filter);
        Task<ContactMessageResponse> GetByIdAsync(Guid id);
        Task<ContactMessageResponse> MarkAsReadAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
