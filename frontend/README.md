# Frontend de apoio 

Front-end em React (Vite + React Router) para testar o backend Fastify + Prisma.
Visual escuro, estilo terminal / console de desenvolvedor (monospace, âmbar).

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```
2. Confirme que o backend está rodando em `http://localhost:4000`
   (o arquivo `src/api.js` já aponta pra essa URL).
3. Rode o front:
   ```
   npm run dev
   ```
4. Abre em `http://localhost:5173`

## Rotas

Agora cada tela tem uma URL de verdade (React Router):

- `/login` — entrar
- `/register` — criar conta
- `/customers` — lista de clientes (com `?page=` e `?search=` refletidos na URL)
- `/customers/new` — cadastrar novo cliente
- `/customers/:id/edit` — editar um cliente específico

Dá pra atualizar a página (F5) em qualquer uma delas sem perder o contexto,
e o botão "voltar" do navegador funciona normalmente. Rotas protegidas
(`/customers*`) redirecionam pra `/login` se não houver token salvo.

## O que tem

- Login / cadastro de usuário (`POST /user/login`, `POST /user`)
- Listagem de clientes com busca e paginação (`GET /customers?page=&limit=&search=`)
- Criar cliente (`POST /customer`)
- Editar cliente (`PATCH /customer/:id`)
- Excluir cliente (`DELETE /customer/:id`)
- Status "Ativo" em verde / "Inativo" em cinza
- Token JWT salvo no `localStorage` e enviado automaticamente nas
  requisições autenticadas

## Estrutura

- `src/api.js` — todas as chamadas pro backend, centralizadas
- `src/App.jsx` — rotas e telas (login, cadastro, lista, criar/editar cliente)
- `src/index.css` — estilo visual (Modelo B)
