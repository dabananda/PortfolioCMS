using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Account;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            await _accountService.ChangePasswordAsync(request);
            return ApiOkMessage("Password changed successfully.");
        }

        [HttpPut("update-name")]
        public async Task<IActionResult> UpdateName([FromBody] UpdateNameRequest request)
        {
            await _accountService.UpdateNameAsync(request);
            return ApiOkMessage("Name updated successfully.");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAccount()
        {
            await _accountService.DeleteAccountAsync();
            return ApiOkMessage("Account deleted successfully.");
        }
    }
}