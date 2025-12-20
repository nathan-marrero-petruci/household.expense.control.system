using System;
using System.Collections.Generic;

namespace ExpenseApi.Models
{
    public enum FinalidadeCategoria
    {
        Despesa = 0,
        Receita = 1,
        Ambas = 2
    }

    public class Categoria
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Descricao { get; set; }
        public FinalidadeCategoria Finalidade { get; set; }
        public List<Transacao> Transacoes { get; set; } = new();
    }
}