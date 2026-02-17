namespace PortfolioCMS.Server.Domain.Common.Exceptions
{
    public abstract class AppException(string message, int statusCode) : Exception(message)
    {
        public int StatusCode { get; } = statusCode;
    }

    public class NotFoundException(string message) : AppException(message, 404) { }
    public class ConflictException(string message) : AppException(message, 409) { }
    public class ValidationException(string message) : AppException(message, 400) { }
    public class UnauthorizedException(string message) : AppException(message, 401) { }
    public class ForbiddenException(string message) : AppException(message, 403) { }
}
