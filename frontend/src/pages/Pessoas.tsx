import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '../services/api';

type Pessoa = { id: string; nome: string; idade: number; transacoes?: any[] };

export default function Pessoas() {
  const [lista, setLista] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');

  const load = async () => {
    try {
      const data = await apiGet<Pessoa[]>('pessoas');
      setLista(data);
    } catch (e) { alert(String(e)); }
  };

  useEffect(() => { load(); }, []);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('pessoas', { nome, idade: Number(idade) });
      setNome(''); setIdade('');
      load();
    } catch (err) { alert(String(err)); }
  };

  const excluir = async (id: string) => {
    if (!confirm('Confirma exclusão da pessoa?')) return;
    try { await apiDelete(`pessoas/${id}`); load(); } catch (e) { alert(String(e)); }
  };

  return (
    <div>
      <h2>Pessoas</h2>
      <form onSubmit={criar}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="Idade" type="number" value={idade as any} onChange={e => setIdade(e.target.value === '' ? '' : Number(e.target.value))} required min={0} />
        <button type="submit">Criar</button>
      </form>

      <ul>
        {lista.map(p => (
          <li key={p.id}>
            {p.nome} (idade: {p.idade}) — <button onClick={() => excluir(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}