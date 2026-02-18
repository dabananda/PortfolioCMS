using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateAccessToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
    }
}