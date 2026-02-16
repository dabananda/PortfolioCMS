using Microsoft.AspNetCore.Identity;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public String FirstName { get; set; } = String.Empty;
        public String LastName { get; set; } = String.Empty;
    }
}
