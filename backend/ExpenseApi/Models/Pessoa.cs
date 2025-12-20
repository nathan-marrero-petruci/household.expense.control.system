using System;
using System.Collections.Generic;

namespace ExpenseApi.Models
{
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; }
        public int Idade { get; set; }
        public List<Transacao> Transacoes { get; set; } = new();
    }
}