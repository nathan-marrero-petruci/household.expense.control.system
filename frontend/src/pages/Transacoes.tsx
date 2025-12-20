import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../services/api';

type Pessoa = { id: string; nome: string; idade: number };
type Categoria = { id: string; descricao: string; finalidade: number };
type Transacao = { id: string; descricao: string; valor: number; tipo: number; pessoaId: string; categoriaId: string; pessoa?: Pessoa; categoria?: Categoria };

export default function Transacoes() {
  const [trans, setTrans] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<number>(0);
  const [pessoaId, setPessoaId] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');

  const load = async () => {
    try {
      setTrans(await apiGet<Transacao[]>('transacoes'));
      setPessoas(await apiGet<Pessoa[]>('pessoas'));
      setCategorias(await apiGet<Categoria[]>('categorias'));
    } catch (e) { alert(String(e)); }
  };

  useEffect(() => { load(); }, []);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('transacoes', {
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId,
        categoriaId
      });
      setDescricao(''); setValor(''); setTipo(0); setPessoaId(''); setCategoriaId('');
      load();
    } catch (err) { alert(String(err)); }
  };

  return (
    <div>
      <h2>Transações</h2>
      <form onSubmit={criar}>
        <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
        <input placeholder="Valor" type="number" step="0.01" value={valor as any} onChange={e => setValor(e.target.value === '' ? '' : Number(e.target.value))} required min={0.01} />
        <select value={tipo} onChange={e => setTipo(Number(e.target.value))}>
          <option value={0}>Despesa</option>
          <option value={1}>Receita</option>
        </select>
        <select value={pessoaId} onChange={e => setPessoaId(e.target.value)} required>
          <option value="">Selecionar pessoa</option>
          {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.idade})</option>)}
        </select>
        <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
          <option value="">Selecionar categoria</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao} ({c.finalidade === 0 ? 'Despesa' : c.finalidade === 1 ? 'Receita' : 'Ambas'})</option>)}
        </select>
        <button type="submit">Criar</button>
      </form>

      <ul>
        {trans.map(t => (
          <li key={t.id}>
            {t.descricao} — {t.valor.toFixed(2)} — {t.tipo === 0 ? 'Despesa' : 'Receita'} — {t.pessoa?.nome ?? t.pessoaId} — {t.categoria?.descricao ?? t.categoriaId}
          </li>
        ))}
      </ul>
    </div>
  );
}