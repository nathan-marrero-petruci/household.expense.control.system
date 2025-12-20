using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers
{
    [ApiController]
    [Route("api/relatorios")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _db;
        public RelatoriosController(AppDbContext db) => _db = db;

        [HttpGet("totais-por-pessoa")]
        public async Task<IActionResult> TotaisPorPessoa()
        {
            var pessoas = await _db.Pessoas.Include(p => p.Transacoes).ToListAsync();

            var lista = pessoas.Select(p =>
            {
                var receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
                return new
                {
                    PessoaId = p.Id,
                    Nome = p.Nome,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = receitas - despesas
                };
            }).ToList();

            var totalReceitas = lista.Sum(x => x.Receitas);
            var totalDespesas = lista.Sum(x => x.Despesas);

            return Ok(new
            {
                PorPessoa = lista,
                Totais = new { TotalReceitas = totalReceitas, TotalDespesas = totalDespesas, SaldoLiquido = totalReceitas - totalDespesas }
            });
        }
    }
}