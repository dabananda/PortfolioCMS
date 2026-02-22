using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class UploadController : BaseController
    {
        private readonly IFileUploadService _fileUploadService;

        public UploadController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost("image")]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest("No file was provided.");

            await using var stream = file.OpenReadStream();
            var url = await _fileUploadService.UploadImageAsync(stream, file.FileName);

            return ApiOk(new { url }, "Image uploaded successfully.");
        }

        [HttpPost("resume")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest("No file was provided.");

            await using var stream = file.OpenReadStream();
            var url = await _fileUploadService.UploadResumeAsync(stream, file.FileName);

            return ApiOk(new { url }, "Resume uploaded successfully.");
        }
    }
}