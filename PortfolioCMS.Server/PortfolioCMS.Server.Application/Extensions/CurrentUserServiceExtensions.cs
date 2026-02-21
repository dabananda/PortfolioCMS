using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Application.Extensions
{
    public static class CurrentUserServiceExtensions
    {
        public static Guid GetUserIdOrThrow(this ICurrentUserService currentUserService)
        {
            if (!currentUserService.IsAuthenticated || currentUserService.UserId is null)
                throw new AppUnauthorizedException("User is not authenticated.");

            return currentUserService.UserId.Value;
        }
    }
}
