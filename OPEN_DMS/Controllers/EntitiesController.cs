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
    public class EntitiesController : ControllerBase
    {
        private readonly OPEN_DMSContext _context;

        public EntitiesController(OPEN_DMSContext context)
        {
            _context = context;
        }

        // GET: api/Entities
        [HttpGet("{entityId}/{accessLevel}")]
        public async Task<ActionResult<object>> GetEntities(int entityId, string accessLevel)
        {
            genericJsonResponse response = new();
            List<Entity> entities = new();
            try
            {
                switch (accessLevel)
                {
                    case CONSTANT.ROOT:
                        entities = await _context.Entities.ToListAsync();
                        break;
                    default:
                        entities = await _context.Entities.Where(e => e.Id == entityId && e.Disabled == false).ToListAsync();
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
                response.data = entities;
            }
            return response;
        }

        // POST: api/Entities
        [HttpPost]
        public async Task<ActionResult<object>> PostEntity([FromBody] genericJsonRequest request)
        {
            genericJsonResponse response = new();
            Entity entityParsed = (Entity)JSON.Parse<Entity>(request.stringify);
            Entity entity;
            try
            {
                response.success = true;
                switch (request.operation)
                {
                    case CONSTANT.CREATE:
                        await _context.Entities.AddAsync(entityParsed);
                        response.message = "created: done";
                        break;

                    case CONSTANT.EDIT:
                        entity = await _context.Entities.FindAsync(entityParsed.Id);
                        entity.EntityName = entityParsed.EntityName;
                        entity.Disabled = entityParsed.Disabled;
                        _context.Entry(entity).State = EntityState.Modified;
                        response.message = "edited: done";
                        break;

                    case CONSTANT.DELETE:
                        entity = await _context.Entities.FindAsync(entityParsed.Id);
                        entity.Disabled = !entity.Disabled;
                        _context.Entry(entity).State = EntityState.Modified;
                        response.message = "deleted: done";
                        break;

                    default:
                        response.success = false;
                        break;
                }
                if(response.success) await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
            }
            return response;
        }

    }
}
