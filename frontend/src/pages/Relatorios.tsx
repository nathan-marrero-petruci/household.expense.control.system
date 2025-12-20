import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

type TotaisPorPessoa = {
  pessoaId: string;
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

type RespShape = {
  PorPessoa?: TotaisPorPessoa[];
  Totais?: { TotalReceitas: number; TotalDespesas: number; SaldoLiquido: number };
  porPessoa?: TotaisPorPessoa[];
  totais?: { totalReceitas: number; totalDespesas: number; saldoLiquido: number };
};

export default function Relatorios() {
  const [dados, setDados] = useState<RespShape | null>(null);

  const load = async () => {
    try {
      setDados(await apiGet<RespShape>('relatorios/totais-por-pessoa'));
    } catch (e) {
      alert(String(e));
    }
  };

  useEffect(() => { load(); }, []);

  // Normaliza os campos recebidos (aceita PorPessoa/Totais ou porPessoa/totais)
  const lista = dados?.PorPessoa ?? dados?.porPessoa ?? [];
  const totais = dados?.Totais ?? (dados?.totais ? {
    TotalReceitas: dados.totais.totalReceitas ?? 0,
    TotalDespesas: dados.totais.totalDespesas ?? 0,
    SaldoLiquido: dados.totais.saldoLiquido ?? 0
  } : { TotalReceitas: 0, TotalDespesas: 0, SaldoLiquido: 0 });

  return (
    <div>
      <h2>Relatórios — Totais por Pessoa</h2>
      {!dados && <div>Carregando...</div>}
      {dados && (
        <>
          <table>
            <thead>
              <tr><th>Nome</th><th>Receitas</th><th>Despesas</th><th>Saldo</th></tr>
            </thead>
            <tbody>
              {lista.map(p => (
                <tr key={p.pessoaId}>
                  <td>{p.nome}</td>
                  <td>{(p.receitas ?? 0).toFixed(2)}</td>
                  <td>{(p.despesas ?? 0).toFixed(2)}</td>
                  <td>{(p.saldo ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Totais</h3>
          <div>Receitas: {(totais.TotalReceitas ?? 0).toFixed(2)}</div>
          <div>Despesas: {(totais.TotalDespesas ?? 0).toFixed(2)}</div>
          <div>Saldo Líquido: {(totais.SaldoLiquido ?? 0).toFixed(2)}</div>
        </>
      )}
    </div>
  );
}