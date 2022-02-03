using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OPEN_DMS.Utils
{
    public class ConnectionString
    {
        public static string server { get; set; }
        public static string database { get; set; }
        public static string user { get; set; }
        public static string password { get; set; }
        public static string Init()
        {

            var Server = Security.Decrypting(server);
            var Database = Security.Decrypting(database);
            var User = Security.Decrypting(user);
            var Password = Security.Decrypting(password);

            return $"server={ Server };uid={ User };pwd={ Password };database={ Database }";
        }
    }
}
