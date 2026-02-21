using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PortfolioCMS.Server.Application.DTOs.Common;

namespace PortfolioCMS.Server.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("api")]
    public class BaseController : ControllerBase
    {
        protected IActionResult ApiOk<T>(T data, string message = "Request successful.")
            => Ok(ApiResponse<T>.Ok(data, message));

        protected IActionResult ApiCreated<T>(T data, string message = "Resource created successfully.")
            => StatusCode(201, ApiResponse<T>.Created(data, message));
        protected IActionResult ApiOkMessage(string message = "Request successful.")
            => Ok(ApiResponse.OkNoData(message));
    }
}