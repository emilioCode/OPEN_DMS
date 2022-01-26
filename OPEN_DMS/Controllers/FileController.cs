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

    }
}
