using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Domain.Common;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class CloudinaryFileUploadService : IFileUploadService
    {
        private readonly Cloudinary _cloudinary;

        private static readonly HashSet<string> AllowedImageExtensions =
            [".jpg", ".jpeg", ".png", ".webp", ".gif"];

        private static readonly HashSet<string> AllowedResumeExtensions =
            [".pdf", ".doc", ".docx"];

        // 5 MB for images, 10 MB for resumes
        private const long MaxImageBytes = 5 * 1024 * 1024;
        private const long MaxResumeBytes = 10 * 1024 * 1024;

        public CloudinaryFileUploadService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"]
                ?? throw new InvalidOperationException("Cloudinary:CloudName is not configured.");
            var apiKey = configuration["Cloudinary:ApiKey"]
                ?? throw new InvalidOperationException("Cloudinary:ApiKey is not configured.");
            var apiSecret = configuration["Cloudinary:ApiSecret"]
                ?? throw new InvalidOperationException("Cloudinary:ApiSecret is not configured.");

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string originalFileName)
        {
            ValidateFile(fileStream, originalFileName, AllowedImageExtensions, MaxImageBytes, "image");

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(originalFileName, fileStream),
                Folder = "portfolio-cms/images",
                // Auto-format and quality for optimal delivery
                Transformation = new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto"),
                UniqueFilename = true,
                Overwrite = false
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error is not null)
                throw new AppValidationException($"Image upload failed: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }

        public async Task<string> UploadResumeAsync(Stream fileStream, string originalFileName)
        {
            ValidateFile(fileStream, originalFileName, AllowedResumeExtensions, MaxResumeBytes, "resume");

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(originalFileName, fileStream),
                Folder = "portfolio-cms/resumes",
                UniqueFilename = true,
                Overwrite = false
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error is not null)
                throw new AppValidationException($"Resume upload failed: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }

        // Helpers
        private static void ValidateFile(
            Stream stream,
            string fileName,
            HashSet<string> allowedExtensions,
            long maxBytes,
            string fileType)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(ext))
                throw new AppValidationException(
                    $"Invalid {fileType} format. Allowed: {string.Join(", ", allowedExtensions)}.");

            if (stream.Length > maxBytes)
                throw new AppValidationException(
                    $"File exceeds the maximum allowed size of {maxBytes / (1024 * 1024)} MB.");
        }
    }
}