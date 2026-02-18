using PortfolioCMS.Server.Application.DTOs.Common;
using PortfolioCMS.Server.Domain.Common;
using System.Net;
using System.Text.Json;

namespace PortfolioCMS.Server.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Unhandled {ExceptionType} on {Method} {Path}: {Message}",
                    ex.GetType().Name,
                    context.Request.Method,
                    context.Request.Path,
                    ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            int statusCode;
            string message;

            if (ex is AppException appEx)
            {
                // Our custom exceptions carry their own status code and a safe message
                statusCode = appEx.StatusCode;
                message = appEx.Message;
            }
            else
            {
                // Unknown exception — never expose internals in production
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = _env.IsDevelopment()
                    ? ex.Message
                    : "An internal server error occurred.";
            }

            var response = new ApiResponse<object>
            {
                Success = false,
                StatusCode = statusCode,
                Message = message,
                // Only include stack trace for non-AppExceptions in Development
                Errors = _env.IsDevelopment() && ex is not AppException
                    ? [ex.StackTrace ?? string.Empty]
                    : null
            };

            // Status code MUST be set before writing the response body
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}