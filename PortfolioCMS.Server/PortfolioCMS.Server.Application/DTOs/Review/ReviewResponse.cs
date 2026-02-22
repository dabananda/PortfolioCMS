namespace PortfolioCMS.Server.Application.DTOs.Review
{
    public class ReviewResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
