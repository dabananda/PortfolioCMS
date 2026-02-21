using Microsoft.AspNetCore.Mvc;
using PortfolioCMS.Server.Application.DTOs.Certification;
using PortfolioCMS.Server.Application.Interfaces;

namespace PortfolioCMS.Server.Api.Controllers
{
    public class CertificationController : BaseController
    {
        private readonly ICertificationService _certificationService;

        public CertificationController(ICertificationService certificationService)
        {
            _certificationService = certificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _certificationService.GetAllAsync();
            return ApiOk(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _certificationService.GetByIdAsync(id);
            return ApiOk(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCertificationRequest request)
        {
            var result = await _certificationService.CreateAsync(request);
            return ApiCreated(result, "Certification created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCertificationRequest request)
        {
            var result = await _certificationService.UpdateAsync(id, request);
            return ApiOk(result, "Certification updated successfully.");
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _certificationService.DeleteAsync(id);
            return ApiOkMessage("Certification deleted successfully.");
        }
    }
}
