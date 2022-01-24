using Microsoft.AspNetCore.Mvc;
using OPEN_DMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OPEN_DMS.Models.Data;
using OPEN_DMS.Utils;
using Microsoft.EntityFrameworkCore;

namespace OPEN_DMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly OPEN_DMSContext _context;
        public LoginController(OPEN_DMSContext context)
        {
            this._context = context;
        }

        // POST: api/Login
        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] User loginUser)
        {
            CustomUser userFinal = null;
            genericJsonResponse response = new();
            try
            {
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
                if(usersList.Count == 0 || userFinal == null)
                {
                    response.message = "Please check the user and password and try it again.";
                }

            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            finally
            {
                response.data = userFinal;
            }
            return response;
        }
    }
}
