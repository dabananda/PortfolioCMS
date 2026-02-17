using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
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

            // Identity
            var identitySettings = configuration.GetSection("IdentitySettings");
            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = identitySettings.GetValue<bool>("PasswordRequireDigit");
                options.Password.RequireLowercase = identitySettings.GetValue<bool>("PasswordRequireLowercase");
                options.Password.RequireUppercase = identitySettings.GetValue<bool>("PasswordRequireUppercase");
                options.Password.RequireNonAlphanumeric = identitySettings.GetValue<bool>("PasswordRequireNonAlphanumeric");
                options.Password.RequiredLength = identitySettings.GetValue<int>("PasswordRequiredLength");
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = identitySettings.GetValue<bool>("RequireConfirmedEmail");
                options.Lockout.MaxFailedAccessAttempts = identitySettings.GetValue<int>("MaxFailedAccessAttempts");
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(identitySettings.GetValue<double>("LockoutTimeSpanMinutes"));
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // JWT
            var jwtSettings = new JwtSettings();
            configuration.Bind("JwtSettings", jwtSettings);

            if (string.IsNullOrWhiteSpace(jwtSettings.Secret))
                throw new InvalidOperationException("JwtSettings:Secret is not configured. Add it to secrets.json.");

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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
                };
            });

            // CORS
            var corsOrigins = configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? [];
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.WithOrigins(corsOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
            });

            // Application services
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<TokenService>();

            return services;
        }
    }
}