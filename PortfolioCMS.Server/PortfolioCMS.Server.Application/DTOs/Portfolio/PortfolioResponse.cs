using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Application.DTOs.Certification;
using PortfolioCMS.Server.Application.DTOs.Education;
using PortfolioCMS.Server.Application.DTOs.ExtraCurricularActivity;
using PortfolioCMS.Server.Application.DTOs.ProblemSolving;
using PortfolioCMS.Server.Application.DTOs.Project;
using PortfolioCMS.Server.Application.DTOs.Review;
using PortfolioCMS.Server.Application.DTOs.Skill;
using PortfolioCMS.Server.Application.DTOs.SocialLink;
using PortfolioCMS.Server.Application.DTOs.UserProfile;
using PortfolioCMS.Server.Application.DTOs.WorkExperience;
using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Application.DTOs.Portfolio
{
    public class PublicProfileResponse
    {
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string HeadLine { get; set; } = string.Empty;
        public UserStatus Status { get; set; }
        public string? ImageUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public string? Location { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }

    public class PublicPortfolioResponse
    {
        public PublicProfileResponse Profile { get; set; } = new();
        public IReadOnlyList<SkillResponse> Skills { get; set; } = [];
        public IReadOnlyList<EducationResponse> Educations { get; set; } = [];
        public IReadOnlyList<WorkExperienceResponse> WorkExperiences { get; set; } = [];
        public IReadOnlyList<ProjectResponse> Projects { get; set; } = [];
        public IReadOnlyList<CertificationResponse> Certifications { get; set; } = [];
        public IReadOnlyList<SocialLinkResponse> SocialLinks { get; set; } = [];
        public IReadOnlyList<ReviewResponse> Reviews { get; set; } = [];
        public IReadOnlyList<ExtraCurricularActivityResponse> ExtraCurricularActivities { get; set; } = [];
        public IReadOnlyList<ProblemSolvingResponse> ProblemSolvings { get; set; } = [];
    }
}
