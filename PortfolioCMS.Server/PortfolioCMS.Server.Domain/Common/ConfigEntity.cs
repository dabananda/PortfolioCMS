namespace PortfolioCMS.Server.Domain.Common
{
    public abstract class ConfigEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}