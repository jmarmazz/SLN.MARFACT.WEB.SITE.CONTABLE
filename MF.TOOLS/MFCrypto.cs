using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace MF.TOOLS
{
    public static class MFCrypto
    {
        private static readonly TripleDESCryptoServiceProvider DES = new TripleDESCryptoServiceProvider();
        private static readonly MD5CryptoServiceProvider MD5 = new MD5CryptoServiceProvider();

        private static byte[] MD5Hash(string value)
        {
            return MD5.ComputeHash(Encoding.ASCII.GetBytes(value));
        }

        public static string CifrarClave(string stringToEncrypt, string key)
        {
            DES.Key = MD5Hash(key);
            DES.Mode = CipherMode.ECB;
            byte[] Buffer = Encoding.ASCII.GetBytes(stringToEncrypt);
            return Convert.ToBase64String(DES.CreateEncryptor().TransformFinalBlock(Buffer, 0, Buffer.Length));
        }

        public static string DescifrarClave(string encryptedString, string key)
        {
            try
            {
                encryptedString = encryptedString.Replace(" ", "+");
                string clave;
                DES.Key = MD5Hash(key);
                DES.Mode = CipherMode.ECB;
                byte[] Buffer = Convert.FromBase64String(encryptedString);
                clave = Encoding.ASCII.GetString(DES.CreateDecryptor().TransformFinalBlock(Buffer, 0, Buffer.Length));
                return clave;
            }
            catch (System.Exception ex)
            {
                return null;
            }
        }

        public static string DescifrarClave(string dataToDecrypt, string password, string salt)
        {
            try
            {
                dataToDecrypt = dataToDecrypt.Replace(" ", "+");
                AesManaged aes = null;
                System.IO.MemoryStream memoryStream = null;
                try
                {
                    Rfc2898DeriveBytes rfc2898 = new Rfc2898DeriveBytes(password, Encoding.UTF8.GetBytes(salt), 10000);
                    aes = new AesManaged();
                    aes.Key = rfc2898.GetBytes(32);
                    aes.IV = rfc2898.GetBytes(16);
                    memoryStream = new System.IO.MemoryStream();
                    CryptoStream cryptoStream = new CryptoStream(memoryStream, aes.CreateDecryptor(), CryptoStreamMode.Write);
                    byte[] data = Convert.FromBase64String(dataToDecrypt);
                    cryptoStream.Write(data, 0, data.Length);
                    cryptoStream.FlushFinalBlock();
                    byte[] decryptBytes = memoryStream.ToArray();
                    if (cryptoStream != null)
                        cryptoStream.Dispose();
                    return Encoding.UTF8.GetString(decryptBytes, 0, decryptBytes.Length);
                }
                finally
                {
                    if (memoryStream != null)
                        memoryStream.Dispose();
                    if (aes != null)
                        aes.Clear();
                }
            }
            catch (System.Exception ex)
            {
                // Return ex.Message.ToString
                return null;
            }
        }
    }
}
