using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OPEN_DMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OPEN_DMS.Models.Data;

namespace OPEN_DMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly OPEN_DMSContext context;
        public LoginController(OPEN_DMSContext _context)
        {
            this.context = _context;
        }

        // POST: api/Login
        [HttpPost]
        public JsonResult Post([FromBody] User loginUser)
        {
           
            var users = from user in context.Users
                        join team in context.Teams on user.TeamId equals team.Id
                        where user.UserAccount == loginUser.UserAccount
                        //&& (Security.checkHash(loginUser.UserPassword, user.UserPassword, Security.hashType.MD5) == true)
                        && user.UserPassword == Security.getHash(loginUser.UserPassword, Security.hashType.MD5)
                        && team.Id == user.TeamId && user.Disabled == false && (team.Disabled == false || user.AccessLevel == "ROOT")
                        select new
                        {
                            id = user.Id,
                            name = user.CompleteName,
                            accessLevel = user.AccessLevel,
                            teamId = user.TeamId,
                            teamName = team.TeamName,
                            userName = user.UserAccount,
                            pathRoot = team.PathRoot,
                            expirationDate = user.ExpirationDate
                        };
   
            object userFinal = null;
            var usersList = users.ToList();
            usersList.ForEach(e =>
            {
                if ((e.userName.Equals(loginUser.UserAccount)) && e.expirationDate <= DateTime.Today) userFinal = e;
            });

            return new JsonResult(userFinal);
        }
    }
}
