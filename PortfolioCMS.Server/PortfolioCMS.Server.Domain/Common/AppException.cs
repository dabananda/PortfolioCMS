namespace PortfolioCMS.Server.Domain.Common
{
    public abstract class AppException(string message, int statusCode) : Exception(message)
    {
        public int StatusCode { get; } = statusCode;
    }

    public class AppNotFoundException(string message) : AppException(message, 404) { }
    public class AppConflictException(string message) : AppException(message, 409) { }
    public class AppValidationException(string message) : AppException(message, 400) { }
    public class AppUnauthorizedException(string message) : AppException(message, 401) { }
    public class AppForbiddenException(string message) : AppException(message, 403) { }
}