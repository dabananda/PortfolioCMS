using PortfolioCMS.Server.Application.DTOs.SocialLink;

namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface ISocialLinkService
    {
        Task<IReadOnlyList<SocialLinkResponse>> GetAllAsync();
        Task<SocialLinkResponse> GetByIdAsync(Guid id);
        Task<SocialLinkResponse> CreateAsync(CreateSocialLinkRequest request);
        Task<SocialLinkResponse> UpdateAsync(Guid id, UpdateSocialLinkRequest request);
        Task DeleteAsync(Guid id);
    }
}
