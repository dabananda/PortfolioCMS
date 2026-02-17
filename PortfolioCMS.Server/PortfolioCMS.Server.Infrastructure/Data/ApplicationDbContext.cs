using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        private readonly ICurrentUserService _currentUserService;

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            ICurrentUserService currentUserService) : base(options)
        {
            _currentUserService = currentUserService;
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogPostCategory> BlogPostCategories { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<CorsSetting> CorsSettings { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<ExtraCurricularActivity> ExtraCurricularActivities { get; set; }
        public DbSet<ProblemSolving> ProblemSolvings { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<SocialLink> SocialLinks { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureQueryFilters(modelBuilder);
            ConfigureBlogPost(modelBuilder);
            ConfigureBlogPostCategory(modelBuilder);
            ConfigureCertification(modelBuilder);
            ConfigureContactMessage(modelBuilder);
            ConfigureCorsSetting(modelBuilder);
            ConfigureEducation(modelBuilder);
            ConfigureExtraCurricularActivity(modelBuilder);
            ConfigureProblemSolving(modelBuilder);
            ConfigureProject(modelBuilder);
            ConfigureReview(modelBuilder);
            ConfigureSkill(modelBuilder);
            ConfigureSocialLink(modelBuilder);
            ConfigureSystemSetting(modelBuilder);
            ConfigureUserProfile(modelBuilder);
            ConfigureWorkExperience(modelBuilder);
        }

        // Audit fields
        public override int SaveChanges()
        {
            ApplyAuditFields();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            ApplyAuditFields();
            return await base.SaveChangesAsync(ct);
        }

        private void ApplyAuditFields()
        {
            var currentUserId = _currentUserService.UserId;

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedBy = currentUserId;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedBy = currentUserId;
                }
            }
        }

        // Soft delete global query filters

        private static void ConfigureQueryFilters(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPost>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<BlogPostCategory>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Certification>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ContactMessage>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<CorsSetting>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Education>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ExtraCurricularActivity>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ProblemSolving>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Project>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Skill>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<SocialLink>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<SystemSetting>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<UserProfile>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<WorkExperience>().HasQueryFilter(e => !e.IsDeleted);
        }

        // Entity configurations

        private static void ConfigureBlogPost(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.BlogPosts)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BlogPostCategory)
                    .WithMany()
                    .HasForeignKey(e => e.BlogPostCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_BlogPosts_UserId");
                entity.HasIndex(e => e.BlogPostCategoryId).HasDatabaseName("IX_BlogPosts_BlogPostCategoryId");
                entity.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_BlogPosts_CreatedAt");
                entity.HasIndex(e => e.IsDeleted).HasDatabaseName("IX_BlogPosts_IsDeleted");
            });
        }

        private static void ConfigureBlogPostCategory(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPostCategory>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.BlogPostCategories)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_BlogPostCategories_UserId");

                entity.HasIndex(e => new { e.Name, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_BlogPostCategories_Name_UserId_Unique");
            });
        }

        private static void ConfigureCertification(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Certification>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CertificationName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.IssuingOrganization).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CredentialId).HasMaxLength(100);
                entity.Property(e => e.CertificateUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Certifications)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_Certifications_UserId");
                entity.HasIndex(e => e.DateObtained).HasDatabaseName("IX_Certifications_DateObtained");
            });
        }

        private static void ConfigureContactMessage(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContactMessage>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.ContactMessages)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_ContactMessages_UserId");
                entity.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_ContactMessages_CreatedAt");
                entity.HasIndex(e => e.Email).HasDatabaseName("IX_ContactMessages_Email");
            });
        }

        private static void ConfigureCorsSetting(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CorsSetting>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AllowedOrigins).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");
            });
        }

        private static void ConfigureEducation(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Education>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.InstituteName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Department).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CGPA).IsRequired().HasPrecision(5, 2);
                entity.Property(e => e.Scale).IsRequired().HasPrecision(5, 2);
                entity.Property(e => e.InstituteLocation).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Educations)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_Educations_UserId");
                entity.HasIndex(e => e.StartDate).HasDatabaseName("IX_Educations_StartDate");
            });
        }

        private static void ConfigureExtraCurricularActivity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExtraCurricularActivity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Organization).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.ExtraCurricularActivities)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_ExtraCurricularActivities_UserId");
                entity.HasIndex(e => e.StartDate).HasDatabaseName("IX_ExtraCurricularActivities_StartDate");
            });
        }

        private static void ConfigureProblemSolving(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProblemSolving>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.JudgeName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Rank).HasMaxLength(50);
                entity.Property(e => e.Handle).HasMaxLength(100);
                entity.Property(e => e.ProfileUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.ProblemSolvings)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_ProblemSolvings_UserId");

                entity.HasIndex(e => new { e.JudgeName, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_ProblemSolvings_JudgeName_UserId_Unique");
            });
        }

        private static void ConfigureProject(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Technologies).HasMaxLength(1000);
                entity.Property(e => e.GitHubUrl).HasMaxLength(500);
                entity.Property(e => e.LiveUrl).HasMaxLength(500);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Projects)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_Projects_UserId");
                entity.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_Projects_CreatedAt");
            });
        }

        private static void ConfigureReview(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Designation).HasMaxLength(100);
                entity.Property(e => e.Rating).IsRequired().HasPrecision(3, 2);
                entity.Property(e => e.Comment).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.ToTable(t =>
                    t.HasCheckConstraint("CK_Reviews_Rating", "[Rating] >= 1.00 AND [Rating] <= 5.00"));

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_Reviews_UserId");
                entity.HasIndex(e => e.Rating).HasDatabaseName("IX_Reviews_Rating");
            });
        }

        private static void ConfigureSkill(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Skill>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.SkillName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Skills)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_Skills_UserId");

                entity.HasIndex(e => new { e.SkillName, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_Skills_SkillName_UserId_Unique");
            });
        }

        private static void ConfigureSocialLink(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SocialLink>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Link).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.SocialLinks)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_SocialLinks_UserId");

                entity.HasIndex(e => new { e.Name, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_SocialLinks_Name_UserId_Unique");
            });
        }

        private static void ConfigureSystemSetting(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SystemSetting>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.SmtpHost).IsRequired().HasMaxLength(200);
                entity.Property(e => e.SmtpPort).IsRequired();
                entity.Property(e => e.SmtpUser).IsRequired().HasMaxLength(200);
                entity.Property(e => e.SmtpPass).IsRequired().HasMaxLength(500);
                entity.Property(e => e.SenderName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.SenderEmail).IsRequired().HasMaxLength(256);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");
            });
        }

        private static void ConfigureUserProfile(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasConversion<string>()
                    .HasMaxLength(50);

                entity.Property(e => e.HeadLine).IsRequired().HasMaxLength(200);
                entity.Property(e => e.ImageUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.ResumeUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithOne(u => u.Profile)
                    .HasForeignKey<UserProfile>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId)
                    .IsUnique()
                    .HasDatabaseName("IX_UserProfiles_UserId_Unique");
            });
        }

        private static void ConfigureWorkExperience(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkExperience>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CompanyDescription).HasMaxLength(1000);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(200);
                entity.Property(e => e.WorkDescription).HasMaxLength(2000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.User)
                    .WithMany(u => u.WorkExperiences)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_WorkExperiences_UserId");
                entity.HasIndex(e => e.StartDate).HasDatabaseName("IX_WorkExperiences_StartDate");
            });
        }
    }
}