namespace PortfolioCMS.Server.Application.DTOs.ProblemSolving
{
    public class ProblemSolvingResponse
    {
        public Guid Id { get; set; }
        public string JudgeName { get; set; } = string.Empty;
        public int TotalSolved { get; set; }
        public string? Rank { get; set; }
        public string? Handle { get; set; }
        public string ProfileUrl { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
