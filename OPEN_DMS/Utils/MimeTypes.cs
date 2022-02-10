using OPEN_DMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OPEN_DMS.Utils
{
    public class MimeTypes
    {
        private static Mimetype mimeType;
        public static async Task<Mimetype> getExtension(string extension)
        {
            using(OPEN_DMSContext db = new())
            {
                try
                {
                    mimeType = await db.Mimetypes.Where(mt => mt.Extension == extension.ToLower()).FirstOrDefaultAsync();
                    if(mimeType is null) mimeType = await db.Mimetypes.Where(mt => mt.Extension == "bin").FirstOrDefaultAsync();
                }
                catch 
                {
                    mimeType = await db.Mimetypes.Where(mt => mt.Extension == "bin").FirstOrDefaultAsync();
                }
            }
            return mimeType;
        }
    }
}
