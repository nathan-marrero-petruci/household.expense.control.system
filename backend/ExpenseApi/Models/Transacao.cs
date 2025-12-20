using System;

namespace ExpenseApi.Models
{
    public enum TipoTransacao
    {
        Despesa = 0,
        Receita = 1
    }

    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }

        public Guid CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        public Guid PessoaId { get; set; }
        public Pessoa? Pessoa { get; set; }
    }
}