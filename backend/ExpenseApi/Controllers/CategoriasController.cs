using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CategoriasController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _db.Categorias.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Categoria input)
        {
            if (string.IsNullOrWhiteSpace(input.Descricao))
                return BadRequest("Descrição obrigatória.");

            input.Id = Guid.NewGuid();
            _db.Categorias.Add(input);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
        }
    }
}