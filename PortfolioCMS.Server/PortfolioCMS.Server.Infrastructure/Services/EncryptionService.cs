using Microsoft.Extensions.Configuration;
using PortfolioCMS.Server.Application.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly byte[] _key;

        public EncryptionService(IConfiguration configuration)
        {
            var rawKey = configuration["EncryptionSettings:Key"]
                ?? throw new InvalidOperationException(
                    "EncryptionSettings:Key is not configured. Add a 32-character key to secrets.json.");

            if (rawKey.Length != 32)
                throw new InvalidOperationException(
                    "EncryptionSettings:Key must be exactly 32 characters (256 bits).");

            _key = Encoding.UTF8.GetBytes(rawKey);
        }

        public string Encrypt(string plaintext)
        {
            var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
            var nonce = RandomNumberGenerator.GetBytes(AesGcm.NonceByteSizes.MaxSize);
            var tag = new byte[AesGcm.TagByteSizes.MaxSize];
            var ciphertext = new byte[plaintextBytes.Length];

            using var aes = new AesGcm(_key, AesGcm.TagByteSizes.MaxSize);
            aes.Encrypt(nonce, plaintextBytes, ciphertext, tag);

            // Format: base64(nonce + tag + ciphertext)
            var combined = new byte[nonce.Length + tag.Length + ciphertext.Length];
            Buffer.BlockCopy(nonce, 0, combined, 0, nonce.Length);
            Buffer.BlockCopy(tag, 0, combined, nonce.Length, tag.Length);
            Buffer.BlockCopy(ciphertext, 0, combined, nonce.Length + tag.Length, ciphertext.Length);

            return Convert.ToBase64String(combined);
        }

        public string Decrypt(string ciphertextBase64)
        {
            var combined = Convert.FromBase64String(ciphertextBase64);

            var nonceSize = AesGcm.NonceByteSizes.MaxSize;
            var tagSize = AesGcm.TagByteSizes.MaxSize;
            var nonce = combined[..nonceSize];
            var tag = combined[nonceSize..(nonceSize + tagSize)];
            var ciphertext = combined[(nonceSize + tagSize)..];
            var plaintext = new byte[ciphertext.Length];

            using var aes = new AesGcm(_key, tagSize);
            aes.Decrypt(nonce, ciphertext, tag, plaintext);

            return Encoding.UTF8.GetString(plaintext);
        }
    }
}