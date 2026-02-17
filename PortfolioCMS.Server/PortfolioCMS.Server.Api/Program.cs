using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Api.Middleware;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure;
using PortfolioCMS.Server.Infrastructure.Data;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Serilog — configure
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File(
        path: "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// Services
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Seeding — roles
using (var scope = app.Services.CreateScope())
{
    try
    {
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

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

// Seeding — default admin user
using (var scope = app.Services.CreateScope())
{
    try
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var adminSection = config.GetSection("AdminUser");

        var email = adminSection["Email"] ?? throw new InvalidOperationException("AdminUser:Email is not configured.");
        var password = adminSection["Password"] ?? throw new InvalidOperationException("AdminUser:Password is not configured.");
        var firstName = adminSection["FirstName"] ?? "Admin";
        var lastName = adminSection["LastName"] ?? "User";

        var existingAdmin = await userManager.FindByEmailAsync(email);
        if (existingAdmin == null)
        {
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
        else
        {
            Log.Information("Admin user already exists, skipping seed.");
        }
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while seeding the admin user.");
    }
}

// Seeding — system settings and CORS settings (only if tables are empty)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        if (!await db.SystemSettings.AnyAsync())
        {
            var emailSection = config.GetSection("EmailSettings");
            db.SystemSettings.Add(new SystemSetting
            {
                SmtpHost = emailSection["SmtpServer"] ?? "smtp.gmail.com",
                SmtpPort = emailSection.GetValue<int>("SmtpPort", 587),
                SmtpUser = emailSection["SmtpUsername"] ?? string.Empty,
                SmtpPass = emailSection["SmtpPassword"] ?? string.Empty,
                SenderName = emailSection["FromName"] ?? "PortfolioCMS",
                SenderEmail = emailSection["FromEmail"] ?? string.Empty,
                EnableSsl = emailSection.GetValue<bool>("EnableSsl", true),
            });
            Log.Information("SystemSettings seeded from configuration.");
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

// Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();

// Structured HTTP request/response logging (Serilog)
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.GetLevel = (httpContext, elapsed, ex) => ex != null
        ? LogEventLevel.Error
        : httpContext.Response.StatusCode >= 500
            ? LogEventLevel.Error
            : LogEventLevel.Information;
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers.UserAgent.ToString());
        diagnosticContext.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown");
    };
});

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{
    Log.Information("Starting PortfolioCMS API...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}