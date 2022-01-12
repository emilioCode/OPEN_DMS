using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OPEN_DMS.Models;

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
        public async Task<ActionResult<IEnumerable<Entity>>> GetEntities(int entityId, string accessLevel)
        {
            List<Entity> entities = new();
            try
            {
                switch (accessLevel)
                {
                    case "ROOT":
                        entities = await _context.Entities.ToListAsync();
                        break;
                    case "ADMINISTRATOR":
                        entities = await _context.Entities.Where(e => e.Id == entityId).ToListAsync();
                        break;
                    default:
                        break;
                }
                
            }
            catch (Exception)
            {
                
            }
            return entities;
        }


        // PUT: api/Entities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntity(int id, Entity entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Entities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Entity>> PostEntity(Entity entity)
        {
            _context.Entities.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEntity", new { id = entity.Id }, entity);
        }

        // DELETE: api/Entities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntity(int id)
        {
            var entity = await _context.Entities.FindAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            _context.Entities.Remove(entity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntityExists(int id)
        {
            return _context.Entities.Any(e => e.Id == id);
        }
    }
}
