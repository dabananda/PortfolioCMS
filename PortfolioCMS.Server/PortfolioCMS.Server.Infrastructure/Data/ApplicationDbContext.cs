using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogPostCategory> BlogPostCategories { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<ExtraCurricularActivity> ExtraCurricularActivities { get; set; }
        public DbSet<ProblemSolving> ProblemSolvings { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<SocialLink> SocialLinks { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure global query filters for soft delete
            ConfigureQueryFilters(modelBuilder);

            // Configure entity relationships and constraints
            ConfigureBlogPost(modelBuilder);
            ConfigureBlogPostCategory(modelBuilder);
            ConfigureCertification(modelBuilder);
            ConfigureContactMessage(modelBuilder);
            ConfigureEducation(modelBuilder);
            ConfigureExtraCurricularActivity(modelBuilder);
            ConfigureProblemSolving(modelBuilder);
            ConfigureProject(modelBuilder);
            ConfigureReview(modelBuilder);
            ConfigureSkill(modelBuilder);
            ConfigureSocialLink(modelBuilder);
            ConfigureUserProfile(modelBuilder);
            ConfigureWorkExperience(modelBuilder);
        }

        private void ConfigureQueryFilters(ModelBuilder modelBuilder)
        {
            // Apply soft delete filter to all entities inheriting from BaseEntity
            modelBuilder.Entity<BlogPost>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<BlogPostCategory>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Certification>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ContactMessage>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Education>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ExtraCurricularActivity>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ProblemSolving>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Project>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Skill>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<SocialLink>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<UserProfile>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<WorkExperience>().HasQueryFilter(e => !e.IsDeleted);
        }

        private void ConfigureBlogPost(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPost>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Post)
                    .IsRequired();

                entity.Property(e => e.ImageUrl)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BlogPostCategory)
                    .WithMany()
                    .HasForeignKey(e => e.BlogPostCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_BlogPosts_UserId");

                entity.HasIndex(e => e.BlogPostCategoryId)
                    .HasDatabaseName("IX_BlogPosts_BlogPostCategoryId");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("IX_BlogPosts_CreatedAt");

                entity.HasIndex(e => e.IsDeleted)
                    .HasDatabaseName("IX_BlogPosts_IsDeleted");
            });
        }

        private void ConfigureBlogPostCategory(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPostCategory>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_BlogPostCategories_UserId");

                entity.HasIndex(e => new { e.Name, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_BlogPostCategories_Name_UserId_Unique");
            });
        }

        private void ConfigureCertification(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Certification>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.CertificationName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.IssuingOrganization)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.CredentialId)
                    .HasMaxLength(100);

                entity.Property(e => e.CertificateUrl)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_Certifications_UserId");

                entity.HasIndex(e => e.DateObtained)
                    .HasDatabaseName("IX_Certifications_DateObtained");
            });
        }

        private void ConfigureContactMessage(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContactMessage>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Subject)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_ContactMessages_UserId");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("IX_ContactMessages_CreatedAt");

                entity.HasIndex(e => e.Email)
                    .HasDatabaseName("IX_ContactMessages_Email");
            });
        }

        private void ConfigureEducation(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Education>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.InstituteName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Department)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.CGPA)
                    .IsRequired()
                    .HasPrecision(5, 2); // Allows values like 4.00, 3.85, etc.

                entity.Property(e => e.Scale)
                    .IsRequired()
                    .HasPrecision(5, 2); // Allows values like 4.00, 5.00, 10.00, etc.

                entity.Property(e => e.InstituteLocation)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_Educations_UserId");

                entity.HasIndex(e => e.StartDate)
                    .HasDatabaseName("IX_Educations_StartDate");
            });
        }

        private void ConfigureExtraCurricularActivity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExtraCurricularActivity>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Organization)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_ExtraCurricularActivities_UserId");

                entity.HasIndex(e => e.StartDate)
                    .HasDatabaseName("IX_ExtraCurricularActivities_StartDate");
            });
        }

        private void ConfigureProblemSolving(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProblemSolving>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.JudgeName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Rank)
                    .HasMaxLength(50);

                entity.Property(e => e.Handle)
                    .HasMaxLength(100);

                entity.Property(e => e.ProfileUrl)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_ProblemSolvings_UserId");

                entity.HasIndex(e => new { e.JudgeName, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_ProblemSolvings_JudgeName_UserId_Unique");
            });
        }

        private void ConfigureProject(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2000);

                // Convert List<string> to comma-separated string for storage
                entity.Property(e => e.Technologies)
                    .HasConversion(
                        v => string.Join(',', v),
                        v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                    )
                    .HasMaxLength(1000);

                entity.Property(e => e.GitHubUrl)
                    .HasMaxLength(500);

                entity.Property(e => e.LiveUrl)
                    .HasMaxLength(500);

                entity.Property(e => e.ImageUrl)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_Projects_UserId");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("IX_Projects_CreatedAt");
            });
        }

        private void ConfigureReview(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Designation)
                    .HasMaxLength(100);

                entity.Property(e => e.Rating)
                    .IsRequired()
                    .HasPrecision(3, 2); // Allows values like 4.75, 5.00

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_Reviews_UserId");

                entity.HasIndex(e => e.Rating)
                    .HasDatabaseName("IX_Reviews_Rating");
            });
        }

        private void ConfigureSkill(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Skill>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.SkillName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_Skills_UserId");

                entity.HasIndex(e => new { e.SkillName, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_Skills_SkillName_UserId_Unique");
            });
        }

        private void ConfigureSocialLink(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SocialLink>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Link)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_SocialLinks_UserId");

                entity.HasIndex(e => new { e.Name, e.UserId })
                    .IsUnique()
                    .HasFilter("[IsDeleted] = 0")
                    .HasDatabaseName("IX_SocialLinks_Name_UserId_Unique");
            });
        }

        private void ConfigureUserProfile(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProfile>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.HeadLine)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.ResumeUrl)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.Location)
                    .HasMaxLength(200);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .IsUnique()
                    .HasDatabaseName("IX_UserProfiles_UserId_Unique");
            });
        }

        private void ConfigureWorkExperience(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkExperience>(entity =>
            {
                // Primary key
                entity.HasKey(e => e.Id);

                // Properties
                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.CompanyDescription)
                    .HasMaxLength(1000);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.WorkDescription)
                    .HasMaxLength(2000);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes
                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_WorkExperiences_UserId");

                entity.HasIndex(e => e.StartDate)
                    .HasDatabaseName("IX_WorkExperiences_StartDate");
            });
        }

        // Override SaveChanges to automatically set UpdatedAt timestamp
        public override int SaveChanges()
        {
            UpdateAuditFields();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditFields();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateAuditFields()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is PortfolioCMS.Server.Domain.Common.BaseEntity);

            foreach (var entry in entries)
            {
                var entity = (PortfolioCMS.Server.Domain.Common.BaseEntity)entry.Entity;

                if (entry.State == EntityState.Modified)
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                    // Note: CreatedBy and UpdatedBy should be set at the service/repository layer
                    // where you have access to the current user context (IHttpContextAccessor)
                }
            }
        }
    }
}