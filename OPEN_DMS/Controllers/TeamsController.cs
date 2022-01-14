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
    public class TeamsController : ControllerBase
    {
        private readonly OPEN_DMSContext _context;

        public TeamsController(OPEN_DMSContext context)
        {
            _context = context;
        }

        // GET: api/Teams
        [HttpGet]
        public async Task<ActionResult<object>> GetTeams(int entityId)
        {
            genericJsonResponse response = new();
            List<Team> teams = new();
            try
            {
                teams = await _context.Teams.Where(t => t.EntityId == entityId).ToListAsync();
                response.success = true;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            finally
            {
                response.data = teams;
            }
            return response;
        }

        // POST: api/Teams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<object>> PostTeam([FromBody] genericJsonRequest request)
        {
            genericJsonResponse response = new();
            Team teamParsed = JSON.Parse<Team>(request.stringify);
            Team team;
            try
            {
                response.success = true;
                switch (request.operation)
                {
                    case CONSTANT.CREATE:
                        await _context.Teams.AddAsync(teamParsed);
                        response.message = "created: done";
                        break;

                    case CONSTANT.EDIT:
                        team = await _context.Teams.FindAsync(teamParsed.Id);
                        team.EntityId = teamParsed.EntityId;
                        team.TeamName = teamParsed.TeamName;
                        team.PathRoot = teamParsed.PathRoot;
                        team.TelephoneNumber = teamParsed.TelephoneNumber;
                        team.HostName = teamParsed.HostName;
                        team.PortNumber = teamParsed.PortNumber;
                        team.Email = teamParsed.Email;
                        team.Pass = teamParsed.Pass;
                        team.Disabled = teamParsed.Disabled;
                        _context.Entry(team).State = EntityState.Modified;
                        response.message = "edited: done";
                        break;

                    case CONSTANT.DELETE:
                        team = await _context.Teams.FindAsync(teamParsed.Id);
                        team.Disabled = !team.Disabled;
                        _context.Entry(team).State = EntityState.Modified;
                        response.message = "deleted: done";
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
    }
}
