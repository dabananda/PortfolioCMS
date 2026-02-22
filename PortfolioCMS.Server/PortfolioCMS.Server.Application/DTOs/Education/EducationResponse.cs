namespace PortfolioCMS.Server.Application.DTOs.Education
{
    public class EducationResponse
    {
        public Guid Id { get; set; }
        public string InstituteName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal CGPA { get; set; }
        public decimal Scale { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string InstituteLocation { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
