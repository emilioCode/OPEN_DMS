using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace OPEN_DMS.Utils
{
    public class JSON
    {
        public static string Stringify(object value)
        {
            return JsonSerializer.Serialize(value);
        }

        public static object Parse<T>(string json, JsonSerializerOptions options = null) where T: new()
        {
            return JsonSerializer.Deserialize<T>(json, options);
        }

    }
}
