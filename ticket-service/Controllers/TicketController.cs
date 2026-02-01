using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketService.Data;
using TicketService.DTOs;

namespace TicketService.Controllers
{
    [ApiController]
    [Route("api/ticket")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TicketsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/ticket
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _db.Tickets
                .Select(t => new TicketAvailabilityDto
                {
                    Code = t.Code,
                    Name = t.Name,
                    Quota = t.Quota,
                    AvailableQuota = t.Quota - t.ReservedQuota
                })
                .ToListAsync();

            return Ok(tickets);
        }


        // Health check
        [HttpGet("/_whoami")]
        public IActionResult WhoAmI()
        {
            return Ok(new { App = "TicketService", Time = DateTime.UtcNow });
        }
    }
}
