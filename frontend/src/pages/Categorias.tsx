import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../services/api';

type Categoria = { id: string; descricao: string; finalidade: number };

export default function Categorias() {
  const [lista, setLista] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<number>(0);

  const load = async () => {
    try { setLista(await apiGet<Categoria[]>('categorias')); } catch (e) { alert(String(e)); }
  };
  useEffect(() => { load(); }, []);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('categorias', { descricao, finalidade });
      setDescricao(''); setFinalidade(0);
      load();
    } catch (err) { alert(String(err)); }
  };

  return (
    <div>
      <h2>Categorias</h2>
      <form onSubmit={criar}>
        <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
        <select value={finalidade} onChange={e => setFinalidade(Number(e.target.value))}>
          <option value={0}>Despesa</option>
          <option value={1}>Receita</option>
          <option value={2}>Ambas</option>
        </select>
        <button type="submit">Criar</button>
      </form>

      <ul>
        {lista.map(c => (
          <li key={c.id}>{c.descricao} — {c.finalidade === 0 ? 'Despesa' : c.finalidade === 1 ? 'Receita' : 'Ambas'}</li>
        ))}
      </ul>
    </div>
  );
}