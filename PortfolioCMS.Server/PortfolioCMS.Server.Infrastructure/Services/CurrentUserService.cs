using Microsoft.AspNetCore.Http;
using PortfolioCMS.Server.Application.Interfaces;
using System.Security.Claims;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var value = _httpContextAccessor.HttpContext?.User
                    .FindFirstValue(ClaimTypes.NameIdentifier);

                return Guid.TryParse(value, out var id) ? id : null;
            }
        }

        public bool IsAuthenticated
            => _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;
    }
}
