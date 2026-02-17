using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class SystemSetting : BaseEntity
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; } = 587;
        public string SmtpUser { get; set; } = string.Empty;
        public string SmtpPass { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;
        public bool EnableSsl { get; set; } = true;
    }
}
