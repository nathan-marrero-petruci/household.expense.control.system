import { useState } from 'react';
import Pessoas from './pages/Pessoas';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes';
import Relatorios from './pages/Relatorios';
import './App.css';

export default function App() {
  const [page, setPage] = useState<'pessoas'|'categorias'|'transacoes'|'relatorios'>('pessoas');

  return (
    <div className="app">
      <header>
        <h1>Expense Control</h1>
        <nav>
          <button onClick={() => setPage('pessoas')}>Pessoas</button>
          <button onClick={() => setPage('categorias')}>Categorias</button>
          <button onClick={() => setPage('transacoes')}>Transações</button>
          <button onClick={() => setPage('relatorios')}>Relatórios</button>
        </nav>
      </header>

      <main>
        {page === 'pessoas' && <Pessoas />}
        {page === 'categorias' && <Categorias />}
        {page === 'transacoes' && <Transacoes />}
        {page === 'relatorios' && <Relatorios />}
      </main>
    </div>
  );
}