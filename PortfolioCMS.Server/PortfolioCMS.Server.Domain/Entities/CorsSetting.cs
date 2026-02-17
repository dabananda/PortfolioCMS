using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class CorsSetting : BaseEntity
    {
        public string AllowedOrigins { get; set; } = string.Empty;
    }
}
