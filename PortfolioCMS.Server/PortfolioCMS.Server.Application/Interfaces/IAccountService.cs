using PortfolioCMS.Server.Application.DTOs.Account;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IAccountService
    {
        Task ChangePasswordAsync(ChangePasswordRequest request);
        Task UpdateNameAsync(UpdateNameRequest request);
        Task DeleteAccountAsync();
    }
}
