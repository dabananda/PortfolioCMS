namespace PortfolioCMS.Server.Application.DTOs.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> Ok(T data, string message = "Request successful.")
            => new() { Success = true, StatusCode = 200, Message = message, Data = data };

        public static ApiResponse<T> Created(T data, string message = "Resource created successfully.")
            => new() { Success = true, StatusCode = 201, Message = message, Data = data };

        public static ApiResponse<T> Fail(int statusCode, string message, List<string>? errors = null)
            => new() { Success = false, StatusCode = statusCode, Message = message, Errors = errors };
    }

    // Non-generic shorthand for responses with no data body
    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse OkNoData(string message = "Request successful.")
            => new() { Success = true, StatusCode = 200, Message = message };
    }
}
