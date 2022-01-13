using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace OPEN_DMS.Utils
{
    public class Security
    {
        public static string Encripting(string password)
        {
            string result = string.Empty;
            try
            {
                byte[] encryted = System.Text.Encoding.Unicode.GetBytes(password);
                result = Convert.ToBase64String(encryted);
            }
            catch (Exception)
            {
            }
            return result;
        }

        public static string Decrypting(string password)
        {
            string result = string.Empty;
            try
            {
                byte[] decryted = Convert.FromBase64String(password);
                result = System.Text.Encoding.Unicode.GetString(decryted);
            }
            catch (Exception)
            {
            }
            return result;
        }


        #region    Obtener y Devolver el Hash de un Texto Especificado

        public enum hashType : int
        {

            MD5,
            SHA1,
            SHA128,
            SHA256,
            SHA384,
            SHA512,
            SHA634
        }

        /// <summary>
        /// Función para Obtener y Devolver el Hash de un Texto Especificado
        /// </summary>
        /// <param name="stringParameterText">Texto a Ser Convertido en Formato HASH</param>
        /// <param name="hashTypeParameter">Tipo de Hash:  MD5, SHA1, SHA128, SHA256, SHA384, SHA512, SHA634.  Default MD5</param>
        /// <returns></returns>
        public static string getHash(string stringParameterText, hashType hashTypeParameter = hashType.MD5)
        {
            // Declaración de Variables, Constantes, Instancias y Objetos Locales a Ser Utiizadas
            string stringHash = string.Empty;

            UnicodeEncoding unicodeEncoding = new UnicodeEncoding();

            byte[] byteHashValue;
            byte[] byteText = unicodeEncoding.GetBytes(stringParameterText);

            // Lógica Principal
            switch (hashTypeParameter)
            {

                case hashType.MD5:
                    {

                        MD5 md5HashString = new MD5CryptoServiceProvider();

                        byteHashValue = md5HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA1:
                    {

                        SHA1Managed sha1HashString = new SHA1Managed();

                        byteHashValue = sha1HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA128:
                    {

                        SHA1Managed sha128HashString = new SHA1Managed();

                        byteHashValue = sha128HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA256:
                    {

                        SHA256Managed sha256HashString = new SHA256Managed();

                        byteHashValue = sha256HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA384:
                    {

                        SHA384Managed sha384HashString = new SHA384Managed();

                        byteHashValue = sha384HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA512:
                    {

                        SHA512Managed sha512HashString = new SHA512Managed();

                        byteHashValue = sha512HashString.ComputeHash(byteText);
                        foreach (byte byteValue in byteHashValue)
                        {

                            stringHash += String.Format("{0:x2}", byteValue);
                        }

                        break;
                    }
                case hashType.SHA634:
                    {

                        break;
                    }
                default:
                    {

                        stringHash = "Tipo de Hash Inválio";
                        break;
                    }
            }

            // Resultado de la Función
            return stringHash;
        }

        #endregion Obtener y Devolver el Hash de un Texto Especificado

        #region    Verificar String vs String Hash

        /// <summary>
        /// Función para Verificar String vs String Hash 
        /// </summary>
        /// <param name="stringTextParameter">Texto Original a Comparar</param>
        /// <param name="stringHashParameter">Texto en Formato Hash a Comparar</param>
        /// <param name="hashTypeParameter">Tipo de Hash:  MD5, SHA1, SHA128, SHA256, SHA384, SHA512, SHA634.  Default MD5</param>
        /// <returns></returns>
        public static bool checkHash(string stringTextParameter, string stringHashParameter, hashType hashTypeParameter = hashType.MD5)
        {

            return (getHash(stringTextParameter, hashTypeParameter) == stringHashParameter);
        }

        #endregion Verificar String vs String Hash
    }
}
