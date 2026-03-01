using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;
using PortfolioCMS.Server.Infrastructure.Services;
using System.Text;
using System.Threading.RateLimiting;

namespace PortfolioCMS.Server.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMemoryCache();
            services.AddHttpContextAccessor();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            AddIdentity(services, configuration);
            AddJwt(services, configuration);
            AddCors(services, configuration);
            AddRateLimiting(services);
            AddHealthChecks(services);
            AddApplicationServices(services);

            return services;
        }

        // Identity
        private static void AddIdentity(IServiceCollection services, IConfiguration configuration)
        {
            var s = configuration.GetSection("IdentitySettings");

            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = s.GetValue<bool>("PasswordRequireDigit");
                options.Password.RequireLowercase = s.GetValue<bool>("PasswordRequireLowercase");
                options.Password.RequireUppercase = s.GetValue<bool>("PasswordRequireUppercase");
                options.Password.RequireNonAlphanumeric = s.GetValue<bool>("PasswordRequireNonAlphanumeric");
                options.Password.RequiredLength = s.GetValue<int>("PasswordRequiredLength");

                // Only allow characters that match our username rules (letters, digits, - and _).
                // This is a server-side safety net on top of the DTO [RegularExpression] attribute.
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyz0123456789-_";
                options.User.RequireUniqueEmail = true;

                options.SignIn.RequireConfirmedEmail = s.GetValue<bool>("RequireConfirmedEmail");

                options.Lockout.MaxFailedAccessAttempts = s.GetValue<int>("MaxFailedAccessAttempts");
                options.Lockout.DefaultLockoutTimeSpan =
                    TimeSpan.FromMinutes(s.GetValue<double>("LockoutTimeSpanMinutes"));
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        }

        // JWT
        private static void AddJwt(IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = new JwtSettings();
            configuration.Bind("JwtSettings", jwtSettings);

            if (string.IsNullOrWhiteSpace(jwtSettings.Secret))
                throw new InvalidOperationException(
                    "JwtSettings:Secret is not configured. Add it to secrets.json.");

            if (string.IsNullOrWhiteSpace(jwtSettings.Issuer))
                throw new InvalidOperationException(
                    "JwtSettings:Issuer is not configured.");

            if (string.IsNullOrWhiteSpace(jwtSettings.Audience))
                throw new InvalidOperationException(
                    "JwtSettings:Audience is not configured.");

            if (jwtSettings.AccessTokenExpirationMinutes <= 0)
                throw new InvalidOperationException(
                    "JwtSettings:AccessTokenExpirationMinutes must be greater than 0.");

            if (jwtSettings.RefreshTokenExpirationDays <= 0)
                throw new InvalidOperationException(
                    "JwtSettings:RefreshTokenExpirationDays must be greater than 0.");

            services.AddSingleton(jwtSettings);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                    ClockSkew = TimeSpan.Zero
                };
            });
        }

        private static void AddCors(IServiceCollection services, IConfiguration configuration)
        {
            var corsOrigins =
                configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? [];

            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.WithOrigins(corsOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
            });
        }

        // Rate Limiting
        private static void AddRateLimiting(IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                // Auth endpoints: 5 requests / minute per IP
                options.AddPolicy("auth", httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: GetClientIp(httpContext),
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window = TimeSpan.FromMinutes(1),
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 0
                        }));

                // General API: 50 requests / minute per IP
                options.AddPolicy("api", httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: GetClientIp(httpContext),
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 50,
                            Window = TimeSpan.FromMinutes(1),
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 5
                        }));
            });
        }

        // Health Checks � SQL Server connectivity via EF Core
        private static void AddHealthChecks(IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>(
                    name: "sql-server",
                    failureStatus: HealthStatus.Unhealthy,
                    tags: ["database", "ready"]);
        }

        // Helpers
        private static string GetClientIp(HttpContext ctx)
            => ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        // Application Services
        private static void AddApplicationServices(IServiceCollection services)
        {
            // Infrastructure
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IEncryptionService, EncryptionService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddSingleton<ITokenService, TokenService>();

            // File uploads (Cloudinary)
            services.AddScoped<IFileUploadService, CloudinaryFileUploadService>();

            // Auth
            services.AddScoped<IAuthService, AuthService>();

            // Account management
            services.AddScoped<IAccountService, AccountService>();

            // Portfolio content (authenticated user managing their own data)
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<ISkillService, SkillService>();
            services.AddScoped<IEducationService, EducationService>();
            services.AddScoped<IWorkExperienceService, WorkExperienceService>();
            services.AddScoped<IExtraCurricularActivityService, ExtraCurricularActivityService>();
            services.AddScoped<IProblemSolvingService, ProblemSolvingService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<ISocialLinkService, SocialLinkService>();
            services.AddScoped<ICertificationService, CertificationService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IContactMessageService, ContactMessageService>();

            // Blog
            services.AddScoped<IBlogPostCategoryService, BlogPostCategoryService>();
            services.AddScoped<IBlogPostService, BlogPostService>();

            // Admin
            services.AddScoped<IAdminSettingsService, AdminSettingsService>();

            // Public portfolio (read-only, anonymous)
            services.AddScoped<IPortfolioService, PortfolioService>();
        }
    }
}