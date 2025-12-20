# household.expense.control.system

Este repositório contém uma aplicação simples para controle de gastos residenciais, composta por:

- Backend: Web API em C# / .NET (pasta `backend/ExpenseApi`).
- Frontend: SPA em React + TypeScript (pasta `frontend`).
- Persistência local: SQLite (arquivo `backend/ExpenseApi/app.db`).

Objetivo
-------
Fornecer um sistema mínimo funcional para cadastrar Pessoas, Categorias e Transações, com regras de negócio básicas e endpoints REST para criação, listagem e exclusão.

Principais funcionalidades implementadas
--------------------------------------
- Cadastro de Pessoas: criação, listagem e deleção. Ao deletar uma pessoa, as transações relacionadas são removidas.
- Cadastro de Categorias: criação e listagem. Cada categoria define uma `Finalidade` (Despesa / Receita / Ambas).
- Cadastro de Transações: criação e listagem. Regras aplicadas:
	- Valores devem ser positivos.
	- Menores de 18 anos só podem registrar despesas.
	- A categoria deve ser compatível com o tipo da transação (Despesa/Receita).
- Relatórios simples: totais por pessoa (receitas, despesas, saldo).

Estrutura do projeto
--------------------
- `backend/ExpenseApi/Controllers` — controladores REST (PessoasController, CategoriasController, TransacoesController).
- `backend/ExpenseApi/Models` — modelos de domínio (`Pessoa`, `Categoria`, `Transacao`).
- `backend/ExpenseApi/Data` — `AppDbContext` (EF Core + SQLite).
- `frontend/src/pages` — páginas React (Pessoas, Categorias, Transacoes, Relatorios).
- `frontend/src/services/api.ts` — helper central para chamadas à API.

Modelos (resumido)
------------------
- `Pessoa`:
	- `Id: Guid`
	- `Nome: string`
	- `Idade: int`

- `Categoria`:
	- `Id: Guid`
	- `Descricao: string`
	- `Finalidade: enum {Despesa, Receita, Ambas}`

- `Transacao`:
	- `Id: Guid`
	- `Descricao: string?`
	- `Valor: decimal`
	- `Tipo: enum {Despesa, Receita}`
	- `CategoriaId: Guid`
	- `PessoaId: Guid`

Regras de negócio importantes
----------------------------
- Menores de 18 só podem criar transações do tipo `Despesa`.
- Categoria deve aceitar o tipo de transação (ex.: categoria marcada apenas para `Receita` não aceita transação do tipo `Despesa`).

API (endpoints principais)
--------------------------
Base URL: `/api`

- Pessoas
	- `GET /api/pessoas` — lista pessoas.
	- `POST /api/pessoas` — cria pessoa. Body JSON: `{ "nome": "Fulano", "idade": 30 }`.
	- `DELETE /api/pessoas/{id}` — remove pessoa (retorna `204 No Content`).

- Categorias
	- `GET /api/categorias` — lista categorias.
	- `POST /api/categorias` — cria categoria. Body JSON: `{ "descricao": "Alimentação", "finalidade": 0 }` (usar enum conforme implementação).

- Transações
	- `GET /api/transacoes` — lista transações (inclui `Pessoa` e `Categoria`).
	- `POST /api/transacoes` — cria transação. Exemplo de body JSON:
		```json
		{
			"descricao": "Compra mercado",
			"valor": 120.50,
			"tipo": 0,
			"pessoaId": "GUID_DA_PESSOA",
			"categoriaId": "GUID_DA_CATEGORIA"
		}
		```

Como executar localmente
------------------------
Pré-requisitos:
- .NET SDK 9 (ou versão compatível com o projeto)
- Node.js + npm

1) Backend

```bash
cd backend/ExpenseApi
dotnet build
dotnet run
```

Por padrão a API inicia em `http://localhost:5256` (ver output do `dotnet run`). O banco SQLite local é criado em `backend/ExpenseApi/app.db`.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend comunica com a API via proxy (`/api`) configurado no Vite.

Exemplos de uso com `curl`
-------------------------
- Criar pessoa:
```bash
curl -X POST http://localhost:5256/api/pessoas -H "Content-Type: application/json" \
	-d '{"nome":"Teste","idade":21}'
```

- Deletar pessoa (espera `204`):
```bash
curl -X DELETE http://localhost:5256/api/pessoas/<ID>
```

- Criar categoria:
```bash
curl -X POST http://localhost:5256/api/categorias -H "Content-Type: application/json" \
	-d '{"descricao":"Salário","finalidade":1}'
```

- Criar transação (substitua GUIDs):
```bash
curl -X POST http://localhost:5256/api/transacoes -H "Content-Type: application/json" \
	-d '{"descricao":"Venda","valor":1000.0,"tipo":1,"pessoaId":"GUID","categoriaId":"GUID"}'
```