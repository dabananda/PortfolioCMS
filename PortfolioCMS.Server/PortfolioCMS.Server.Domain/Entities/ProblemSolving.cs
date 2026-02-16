using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class ProblemSolving : BaseEntity
    {
        public string JudgeName { get; set; } = string.Empty;
        public int TotalSolved { get; set; }
        public string? Rank { get; set; }
        public string? Handle { get; set; }
        public string ProfileUrl { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
