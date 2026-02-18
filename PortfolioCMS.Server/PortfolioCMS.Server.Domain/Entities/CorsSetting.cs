using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class CorsSetting : ConfigEntity
    {
        public string AllowedOrigins { get; set; } = string.Empty;
    }
}