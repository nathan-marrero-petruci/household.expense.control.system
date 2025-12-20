using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TransacoesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _db.Transacoes.Include(t => t.Pessoa).Include(t => t.Categoria).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Transacao input)
        {
            if (string.IsNullOrWhiteSpace(input.Descricao) || input.Valor <= 0)
                return BadRequest("Descrição e Valor (>0) são obrigatórios.");

            var pessoa = await _db.Pessoas.FindAsync(input.PessoaId);
            if (pessoa == null) return BadRequest("Pessoa não encontrada.");

            var categoria = await _db.Categorias.FindAsync(input.CategoriaId);
            if (categoria == null) return BadRequest("Categoria não encontrada.");

            if (pessoa.Idade < 18 && input.Tipo == TipoTransacao.Receita)
                return BadRequest("Pessoas menores de 18 só podem registrar despesas.");

            if (categoria.Finalidade == FinalidadeCategoria.Despesa && input.Tipo == TipoTransacao.Receita)
                return BadRequest("Categoria marcada apenas para despesas; não é compatível com receita.");

            if (categoria.Finalidade == FinalidadeCategoria.Receita && input.Tipo == TipoTransacao.Despesa)
                return BadRequest("Categoria marcada apenas para receitas; não é compatível com despesa.");

            input.Id = Guid.NewGuid();
            _db.Transacoes.Add(input);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
        }
    }
}