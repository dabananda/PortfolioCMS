using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using Serilog;

namespace PortfolioCMS.Server.Infrastructure.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            await SeedRolesAsync(services);
            await SeedAdminUserAsync(services);
            await SeedInitialSettingsAsync(services);
        }

        private static async Task SeedRolesAsync(IServiceProvider services)
        {
            try
            {
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

                if (!await roleManager.RoleExistsAsync(Role.Admin))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(Role.Admin));

                if (!await roleManager.RoleExistsAsync(Role.User))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(Role.User));

                Log.Information("Role seeding completed.");
            }
            catch (Exception ex)
            {
                Log.Error(ex, "An error occurred while seeding roles.");
            }
        }

        private static async Task SeedAdminUserAsync(IServiceProvider services)
        {
            try
            {
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                var config = services.GetRequiredService<IConfiguration>();
                var adminSection = config.GetSection("AdminUser");

                var email = adminSection["Email"] ?? throw new InvalidOperationException("AdminUser:Email is not configured.");
                var password = adminSection["Password"] ?? throw new InvalidOperationException("AdminUser:Password is not configured.");
                var firstName = adminSection["FirstName"] ?? "Admin";
                var lastName = adminSection["LastName"] ?? "User";

                if (await userManager.FindByEmailAsync(email) is not null)
                {
                    Log.Information("Admin user already exists, skipping seed.");
                    return;
                }

                var adminUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, Role.Admin);
                    Log.Information("Default admin user seeded: {Email}", email);
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    Log.Error("Failed to seed admin user: {Errors}", errors);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "An error occurred while seeding the admin user.");
            }
        }

        private static async Task SeedInitialSettingsAsync(IServiceProvider services)
        {
            try
            {
                var db = services.GetRequiredService<ApplicationDbContext>();
                var config = services.GetRequiredService<IConfiguration>();
                var encryption = services.GetRequiredService<IEncryptionService>();

                var emailSection = config.GetSection("EmailSettings");
                var rawPassword = emailSection["SmtpPassword"] ?? string.Empty;

                var existingSettings = await db.SystemSettings.FirstOrDefaultAsync();

                if (existingSettings is null)
                {
                    db.SystemSettings.Add(new SystemSetting
                    {
                        SmtpHost = emailSection["SmtpServer"] ?? "smtp.gmail.com",
                        SmtpPort = emailSection.GetValue<int>("SmtpPort", 587),
                        SmtpUser = emailSection["SmtpUsername"] ?? string.Empty,
                        SmtpPassEncrypted = string.IsNullOrEmpty(rawPassword)
                            ? string.Empty
                            : encryption.Encrypt(rawPassword),
                        SenderName = emailSection["FromName"] ?? "PortfolioCMS",
                        SenderEmail = emailSection["FromEmail"] ?? string.Empty,
                        EnableSsl = emailSection.GetValue<bool>("EnableSsl", true),
                    });

                    Log.Information("SystemSettings seeded from configuration.");
                }
                else if (string.IsNullOrEmpty(existingSettings.SmtpPassEncrypted) && !string.IsNullOrEmpty(rawPassword))
                {
                    existingSettings.SmtpHost = emailSection["SmtpServer"] ?? existingSettings.SmtpHost;
                    existingSettings.SmtpPort = emailSection.GetValue<int>("SmtpPort", existingSettings.SmtpPort);
                    existingSettings.SmtpUser = emailSection["SmtpUsername"] ?? existingSettings.SmtpUser;
                    existingSettings.SmtpPassEncrypted = encryption.Encrypt(rawPassword);
                    existingSettings.SenderName = emailSection["FromName"] ?? existingSettings.SenderName;
                    existingSettings.SenderEmail = emailSection["FromEmail"] ?? existingSettings.SenderEmail;
                    existingSettings.EnableSsl = emailSection.GetValue<bool>("EnableSsl", existingSettings.EnableSsl);

                    Log.Information("SystemSettings updated with email credentials from configuration.");
                }

                if (!await db.CorsSettings.AnyAsync())
                {
                    var origins = config.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? [];
                    db.CorsSettings.Add(new CorsSetting
                    {
                        AllowedOrigins = string.Join(",", origins)
                    });
                    Log.Information("CorsSettings seeded from configuration.");
                }

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "An error occurred while seeding initial settings.");
            }
        }
    }
}