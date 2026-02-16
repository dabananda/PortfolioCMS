using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class ContactForm : BaseEntity
    {
        public String FullName { get; set; } = String.Empty;
        public String Email { get; set; } = String.Empty;
        public String Subject { get; set; } = String.Empty;
        public String Description { get; set; } = String.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
