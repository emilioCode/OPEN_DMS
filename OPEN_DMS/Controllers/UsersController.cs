using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OPEN_DMS.Models;
using OPEN_DMS.Models.Data;
using OPEN_DMS.Utils;

namespace OPEN_DMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly OPEN_DMSContext _context;

        public UsersController(OPEN_DMSContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<object>> GetUsers(string userAccount)
        {
            //return await _context.Users.ToListAsync();
            genericJsonResponse response = new();
            List<User> users = new();
            try
            {
                User session = await this.findByUserAccount(userAccount);

                switch (session.AccessLevel)
                {
                    case CONSTANT.ROOT:
                        users = await _context.Users.Where(user => user.EntityId == session.EntityId).ToListAsync();
                        break;
                    case CONSTANT.ADMINISTRATOR:
                        users = await _context.Users.Where(user => user.EntityId == session.EntityId && user.AccessLevel != CONSTANT.ROOT).ToListAsync();
                        break;
                    default:
                        users.Add(session);
                        break;
                }
                response.success = true;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            finally
            {
                response.data = users;
            }
            return response;
        }

        //POST: api/Users
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<object>> PostUser([FromBody] genericJsonRequest request)
        {
            genericJsonResponse response = new();
            User userParsed = JSON.Parse<User>(request.stringify);
            User user;
            try
            {
                response.success = true;
                switch (request.operation)
                {
                    case CONSTANT.CREATE:
                        bool checkedAccount = _context.Users.Where(u => u.EntityId == userParsed.EntityId && u.UserAccount.ToLower() == userParsed.UserAccount.ToLower()).ToArrayAsync() == null ? true: false;
                        if(checkedAccount)
                        {
                            response.message = "the user account must be distinct";
                            response.success = false;
                        }
                        else
                        {
                            DateTime date = DateTime.Today;
                            userParsed.CreatedDate = date;
                            userParsed.UserPassword = Security.getHash(userParsed.UserPassword, Security.hashType.MD5).ToString();
                            await _context.Users.AddAsync(userParsed);
                            response.message = "created: done";
                        }
                        break;

                    case CONSTANT.EDIT:
                        user = await _context.Users.FindAsync(userParsed.Id);
                        user.CompleteName = userParsed.CompleteName;
                        user.Description = userParsed.Description;
                        user.TeamId = userParsed.TeamId;
                        user.EntityId = userParsed.EntityId;
                        user.AccessLevel = userParsed.AccessLevel;
                        user.ExpirationDate = userParsed.ExpirationDate;
                        user.Disabled = userParsed.Disabled;
                        _context.Entry(user).State = EntityState.Modified;
                        response.message = "edited: done";
                        break;

                    case CONSTANT.DELETE:
                        user = await _context.Users.FindAsync(userParsed.Id);
                        user.Disabled = !user.Disabled;
                        _context.Entry(user).State = EntityState.Modified;
                        response.message = "deleted: done";
                        break;
                    case "change_password":
                        user = await _context.Users.Where(x => x.EntityId == userParsed.EntityId && x.UserAccount == userParsed.UserAccount).FirstAsync();
                        user.UserPassword = Security.getHash(userParsed.UserPassword, Security.hashType.MD5).ToString();
                        if (response.success) await _context.SaveChangesAsync();
                        break;
                    default:
                        response.success = false;
                        break;
                }
                if (response.success) await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            return response;
        }

        private async Task<User> findByUserAccount(string userAccount)
        {
            return await _context.Users.Where(user => user.UserAccount == userAccount).FirstOrDefaultAsync();
        }


    }
}
