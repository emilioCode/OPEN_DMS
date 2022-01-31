using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OPEN_DMS.Models;
using OPEN_DMS.Models.Data;
using OPEN_DMS.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OPEN_DMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly OPEN_DMSContext _context;

        public FileController(OPEN_DMSContext context)
        {
            _context = context;
        }

        // GET: api/File
        [HttpGet]
        public async Task<ActionResult<object>> GetTeams(string userAccount, string passwordAccount, int? teamId = null)
        {
            genericJsonResponse response = new();
            List<Document> documents = new();
            try
            {
                CustomUser userFinal = null;
                User loginUser = new();
                loginUser.UserAccount = userAccount;
                loginUser.UserPassword = passwordAccount;
                
                var usersList = await UsersController.getUserListAsync(loginUser, false);
                usersList.ForEach(e =>
                {
                    if (e.userName.Equals(loginUser.UserAccount))
                    {
                        if (DateTime.Today <= e.expirationDate)
                        {
                            response.success = true;
                            userFinal = e;
                        }
                        else
                        {
                            response.message = "The UserAccount has expired. Please contact with Technical Support.";
                        }
                    }
                });

                if (userFinal == null)
                {
                    response.message = "Please check the user and password and try it again.";
                }
                else
                {
                    documents =  await (from document in _context.Documents
                                       where document.EntityId == userFinal.entityId 
                                       && (
                                       (document.IdUser == userFinal.id) || ((userFinal.accessLevel == CONSTANT.ROOT || userFinal.accessLevel == CONSTANT.ADMINISTRATOR) )
                                       )
                                       select document).ToListAsync();
                    if ((userFinal.accessLevel == CONSTANT.ROOT || userFinal.accessLevel == CONSTANT.ADMINISTRATOR) && teamId != null) documents = documents.Where(dc => dc.TeamId == teamId).ToList();
                }
                
                response.success = true;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            finally
            {
                response.data = documents;
            }
            return response;
        }
        // POST: api/File
        [HttpPost]
        public async Task<ActionResult> PostFiles(string userAccount, string passwordAccount, string commentDetail, string distinctDetail, [FromForm] List<IFormFile> files)
        {
            genericJsonResponse response = new();
            try
            {
                if (string.IsNullOrEmpty(userAccount) || string.IsNullOrEmpty(passwordAccount))
                {
                    response.message = "Please check the userAccount and/or the passwordAccount. Try again or contact to Administrator.";
                }
                else
                {
                    CustomUser userFinal = null;
                    User loginUser = new();
                    loginUser.UserAccount = userAccount;
                    loginUser.UserPassword = passwordAccount;

                    var usersList = await UsersController.getUserListAsync(loginUser);
                    usersList.ForEach(e =>
                    {
                        if (e.userName.Equals(loginUser.UserAccount))
                        {
                            if (DateTime.Today <= e.expirationDate)
                            {
                                response.success = true;
                                userFinal = e;
                            }
                            else
                            {
                                response.message = "The UserAccount has expired. Please contact with Technical Support.";
                            }
                        }
                    });

                    if (userFinal == null)
                    {
                        response.message = "Please check the user and password and try it again.";
                    }
                    else
                    {
                        List<Document> documents = new();
                        if (files.Count > 0)
                        {
                            foreach (var file in files)
                            {
                                DateTime now = DateTime.Now;
                                string fileName = Path.GetFileNameWithoutExtension(file.FileName) + "_" + now.ToString("MMddyyHHmmss") + Path.GetExtension(file.FileName);
                                string filePath = userFinal.pathRoot + "\\" + fileName;
                                using (var stream = System.IO.File.Create(filePath))
                                {
                                    await file.CopyToAsync(stream);
                                }
                                double size = file.Length;
                                size = size / 1000000;
                                Document document = new Document();
                                size = Math.Round(size, 3);
                                document.FileName = Path.GetFileNameWithoutExtension(fileName);
                                document.Extension = Path.GetExtension(fileName).Substring(1);
                                document.Size = (float)size; /*KB*/
                                document.PathAlternative = userFinal.pathRoot;
                                document.EntityId = userFinal.entityId;
                                document.TeamId = (int)userFinal.teamId;
                                document.IdUser = userFinal.id;
                                document.CommentDetail = commentDetail;
                                document.DistinctDetail = distinctDetail;
                                document.InsertionDate = now;
                                documents.Add(document);
                            }

                            await _context.Documents.AddRangeAsync(documents);
                            if (response.success) await _context.SaveChangesAsync();

                            response.data = documents;
                        }
                        response.message = $"{documents.Count} files uploaded.";
                    }

                }
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                return BadRequest(response);
            }
            return Ok(response);
        }

        #region DownloadFile - async
        /*[HttpGet("[action]")]
        public async Task<ActionResult> DownloadFile(string userAccount, string passwordAccount, string idFiles)
        {
            List<int> idDocuments = JSON.Parse<List<int>>(idFiles);
            FileContentResult result = null;
            List<object> objects = new();
            genericJsonResponse response = new();
            try
            {
                if (string.IsNullOrEmpty(userAccount) || string.IsNullOrEmpty(passwordAccount))
                {
                    response.message = "Please check the userAccount and/or the passwordAccount. Try again or contact to Administrator.";
                }
                else
                {
                    CustomUser userFinal = null;
                    User loginUser = new();
                    loginUser.UserAccount = userAccount;
                    loginUser.UserPassword = passwordAccount;

                    var usersList = await UsersController.getUserListAsync(loginUser, false);
                    usersList.ForEach(e =>
                    {
                        if (e.userName.Equals(loginUser.UserAccount))
                        {
                            if (DateTime.Today <= e.expirationDate)
                            {
                                response.success = true;
                                userFinal = e;
                            }
                            else
                            {
                                response.message = "The UserAccount has expired. Please contact with Technical Support.";
                            }
                        }
                    });

                    if (userFinal == null)
                    {
                        response.message = "Please check the user and password and try it again.";
                    }
                    else
                    {
                        idDocuments.ForEach(async document =>
                       {
                           var file = await _context.Documents
                           .Where(f => f.Id == document && f.Disabled == false && f.EntityId == userFinal.entityId
                           && (f.TeamId == userFinal.teamId || userFinal.accessLevel == CONSTANT.ADMINISTRATOR || userFinal.accessLevel == CONSTANT.ROOT)).SingleOrDefaultAsync();
                           if (file is not null)
                           {
                               string fileName = $"{file.FileName}.{file.Extension}";
                               string filePath = $"{file.PathAlternative}\\{fileName}";
                               byte[] data = await System.IO.File.ReadAllBytesAsync(filePath);
                               Mimetype contentType = await MimeTypes.getExtension(file.Extension);// MimeTypes.Dictionary[file.Extension];
                               
                               result = new FileContentResult(data, contentType.MimeType1)//"image/jpeg")//"application/octet-stream")
                               {
                                   FileDownloadName = fileName
                               };

                               objects.Add( new
                               {
                                   id = file.Id,
                                   FileContents = result.FileContents,
                                   ContentType = result.ContentType,
                                   FileDownloadName = result.FileDownloadName,
                                   LastModified = result.LastModified,
                                   EntityTag = result.EntityTag,
                                   EnableRangeProcessing = result.EnableRangeProcessing
                               });
                           }
                       });
                        response.data = objects;
                        #region Dont touch until end
                        //var data = await System.IO.File.ReadAllBytesAsync("D:\\OPEN_DMS_Storage\\1638370138993_012622002442.jpg");
                        ///
                        //result = new FileContentResult(data, "image/jpeg")//"application/octet-stream")
                        //{
                        //    FileDownloadName = "1638370138993_012622002442.jpg"
                        //};
                        ////return result;
                        #endregion Dont touch until end
                    }

                }
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                return BadRequest(response);
                //return new FileContentResult(null, "application/octet-stream");
            }
            return Ok(response);
            //return result;
        }*/
        #endregion DownloadFile - async

        [HttpGet("[action]")]
        public ActionResult DownloadFile(string userAccount, string passwordAccount, string idFiles)
        {
            List<int> idDocuments = JSON.Parse<List<int>>(idFiles);
            FileContentResult result = null;
            List<object> objects = new();
            genericJsonResponse response = new();
            try
            {
                if (string.IsNullOrEmpty(userAccount) || string.IsNullOrEmpty(passwordAccount))
                {
                    response.message = "Please check the userAccount and/or the passwordAccount. Try again or contact to Administrator.";
                }
                else
                {
                    CustomUser userFinal = null;
                    User loginUser = new();
                    loginUser.UserAccount = userAccount;
                    loginUser.UserPassword = passwordAccount;

                    string hashString =  loginUser.UserPassword;
                    var usersList = (from user in _context.Users
                                     join team in _context.Teams on user.TeamId equals team.Id
                                     join entity in _context.Entities on user.EntityId equals entity.Id
                                     where user.UserAccount == loginUser.UserAccount
                                     && user.UserPassword == hashString
                                     && team.Id == user.TeamId && user.Disabled == false && ((team.Disabled == false && entity.Disabled == false) || user.AccessLevel == CONSTANT.ROOT)
                                     select new CustomUser(
                                       user.Id,
                                       user.CompleteName,
                                       user.AccessLevel,
                                       user.EntityId,
                                       entity.EntityName,
                                       user.TeamId,
                                       team.TeamName,
                                       user.UserAccount,
                                       user.UserPassword,
                                       team.PathRoot,
                                       user.ExpirationDate
                                   )).ToList();

                    usersList.ForEach(e =>
                    {
                        if (e.userName.Equals(loginUser.UserAccount))
                        {
                            if (DateTime.Today <= e.expirationDate)
                            {
                                response.success = true;
                                userFinal = e;
                            }
                            else
                            {
                                response.message = "The UserAccount has expired. Please contact with Technical Support.";
                            }
                        }
                    });

                    if (userFinal == null)
                    {
                        response.message = "Please check the user and password and try it again.";
                    }
                    else
                    {
                        idDocuments.ForEach( document =>
                        {
                            var file = _context.Documents
                            .Where(f => f.Id == document && f.Disabled == false && f.EntityId == userFinal.entityId
                            && (f.TeamId == userFinal.teamId || userFinal.accessLevel == CONSTANT.ADMINISTRATOR || userFinal.accessLevel == CONSTANT.ROOT)).SingleOrDefault();

                            if (file is not null)
                            {
                                string fileName = $"{file.FileName}.{file.Extension}";
                                string filePath = $"{file.PathAlternative}\\{fileName}";
                                byte[] data =  System.IO.File.ReadAllBytes(filePath);
                               
                                Mimetype contentType =  _context.Mimetypes.Where(mt => mt.Extension == file.Extension.ToLower()).FirstOrDefault();
                                if (contentType is null) contentType =  _context.Mimetypes.Where(mt => mt.Extension == "bin").FirstOrDefault();

                                result = new FileContentResult(data, contentType.MimeType1)
                                {
                                    FileDownloadName = fileName
                                };

                                objects.Add(new
                                {
                                    id = file.Id,
                                    FileContents = result.FileContents,
                                    ContentType = result.ContentType,
                                    FileDownloadName = result.FileDownloadName,
                                    LastModified = result.LastModified,
                                    EntityTag = result.EntityTag,
                                    EnableRangeProcessing = result.EnableRangeProcessing
                                });
                            }
                        });
                        response.data = objects;
                    }

                }
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                return BadRequest(response);
            }
            return Ok(response);
        }

    }
}
