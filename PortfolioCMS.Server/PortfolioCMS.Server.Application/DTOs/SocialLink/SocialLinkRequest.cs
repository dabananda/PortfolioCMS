using System.ComponentModel.DataAnnotations;

namespace PortfolioCMS.Server.Application.DTOs.SocialLink
{
    public class CreateSocialLinkRequest
    {
        [Required(ErrorMessage = "Platform name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Link is required.")]
        [Url(ErrorMessage = "Link must be a valid URL.")]
        [MaxLength(500, ErrorMessage = "Link cannot exceed 500 characters.")]
        public string Link { get; set; } = string.Empty;
    }

    public class UpdateSocialLinkRequest : CreateSocialLinkRequest { }
}
