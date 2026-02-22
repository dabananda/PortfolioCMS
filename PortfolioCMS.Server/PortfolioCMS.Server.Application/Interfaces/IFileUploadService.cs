namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadImageAsync(Stream fileStream, string originalFileName);

        Task<string> UploadResumeAsync(Stream fileStream, string originalFileName);
    }
}
