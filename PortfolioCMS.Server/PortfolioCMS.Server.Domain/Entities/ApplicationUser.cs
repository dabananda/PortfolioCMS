using Microsoft.AspNetCore.Identity;

namespace PortfolioCMS.Server.Domain.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public UserProfile? Profile { get; set; }
        public ICollection<BlogPost> BlogPosts { get; set; } = [];
        public ICollection<BlogPostCategory> BlogPostCategories { get; set; } = [];
        public ICollection<Certification> Certifications { get; set; } = [];
        public ICollection<ContactMessage> ContactMessages { get; set; } = [];
        public ICollection<Education> Educations { get; set; } = [];
        public ICollection<ExtraCurricularActivity> ExtraCurricularActivities { get; set; } = [];
        public ICollection<ProblemSolving> ProblemSolvings { get; set; } = [];
        public ICollection<Project> Projects { get; set; } = [];
        public ICollection<Review> Reviews { get; set; } = [];
        public ICollection<Skill> Skills { get; set; } = [];
        public ICollection<SocialLink> SocialLinks { get; set; } = [];
        public ICollection<WorkExperience> WorkExperiences { get; set; } = [];
    }
}
