using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

                // Auth endpoints: 5 requests per minute per IP
                options.AddFixedWindowLimiter("auth", opt =>
                {
                    opt.PermitLimit = 5;
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    opt.QueueLimit = 0;
                });

                // General API: 50 requests per minute per IP
                options.AddFixedWindowLimiter("api", opt =>
                {
                    opt.PermitLimit = 50;
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    opt.QueueLimit = 5;
                });
            });
        }

        // Application Services
        private static void AddApplicationServices(IServiceCollection services)
        {
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEncryptionService, EncryptionService>();
            services.AddSingleton<ITokenService, TokenService>();
            services.AddScoped<ICertificationService, CertificationService>();
        }
    }
}