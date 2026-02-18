namespace PortfolioCMS.Server.Application.Interfaces
{
    public interface IEncryptionService
    {
        string Encrypt(string plaintext);
        string Decrypt(string ciphertext);
    }
}
