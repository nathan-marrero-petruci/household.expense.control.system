using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PessoasController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _db.Pessoas.Include(p => p.Transacoes).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Pessoa input)
        {
            if (string.IsNullOrWhiteSpace(input.Nome) || input.Idade < 0)
                return BadRequest("Nome obrigatório e Idade deve ser >= 0.");

            input.Id = Guid.NewGuid();
            _db.Pessoas.Add(input);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var p = await _db.Pessoas.FindAsync(id);
            if (p == null) return NotFound();
            _db.Pessoas.Remove(p);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}