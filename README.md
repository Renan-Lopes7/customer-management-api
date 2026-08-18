# Customer Management API

API REST para gestão de clientes, construída como projeto de estudo com foco em **backend**. O front-end incluído no repositório é apenas uma ferramenta de apoio, feita para testar visualmente os endpoints — o objetivo principal deste projeto sempre foi a API em si.

<p align="center">
  <img width="49%" alt="Tela de login" src="https://github.com/user-attachments/assets/aef8ec53-caa1-482e-a4af-05b8734bc38a" />
  <img width="49%" alt="Lista de clientes" src="https://github.com/user-attachments/assets/b6009c02-4058-43db-a465-bf5fc89648aa" />
</p>

## Sobre o projeto

Comecei esse projeto num curso de Node.js + TypeScript e, a partir dele, fui evoluindo por conta própria: troquei o banco de MongoDB para MySQL, desenhei uma relação real entre usuários e clientes, implementei autenticação, e fechei um CRUD completo com paginação, busca e validação.

A ideia era sair do "só funciona" e entender **por que** cada peça existe — como o Prisma gera o client, como funciona um JWT por baixo dos panos, por que paginação usa `skip`/`take`, por que separar validação de regra de negócio.

## Stack

- **Node.js** + **TypeScript**
- **Fastify** — framework HTTP
- **Prisma ORM** + **MySQL**
- **JWT** (`@fastify/jwt`) — autenticação
- **bcryptjs** — hash de senha
- **Zod** — validação de dados de entrada
- **React** (Vite) — front-end de apoio, só para testar a API visualmente

## Funcionalidades

- Cadastro e login de usuário, com senha criptografada (bcrypt) e token JWT
- Relação **User → Customer** (1 para N): cada cliente cadastrado fica vinculado a quem o criou
- CRUD completo de clientes: criar, listar, buscar por id, editar, excluir
- Todas as rotas de cliente protegidas por autenticação (middleware valida o JWT)
- Paginação (`?page=`, `?limit=`) e busca por nome/e-mail (`?search=`) na listagem
- Validação de entrada com Zod na criação de cliente
- Tratamento de erro centralizado (`setErrorHandler`), com mensagens específicas para erro de validação, erro de negócio e erro inesperado
- Script de seed (`prisma/seed.js`) para popular o banco com clientes fictícios

## Endpoints

| Método | Rota                  | Descrição                          | Autenticado |
|--------|------------------------|-------------------------------------|:-----------:|
| POST   | `/user`                | Cadastra um usuário                 |      —      |
| POST   | `/user/login`          | Login, retorna o token JWT          |      —      |
| POST   | `/customer`             | Cria um cliente                     |      ✅      |
| GET    | `/customers`            | Lista clientes (paginação + busca)  |      ✅      |
| GET    | `/customer/:id`         | Busca um cliente específico         |      ✅      |
| PATCH  | `/customer/:id`         | Atualiza um cliente (parcial)       |      ✅      |
| DELETE | `/customer/:id`         | Remove um cliente                   |      ✅      |

## O que aprendi construindo isso

- Diferença entre gerar o Prisma Client com engine clássico (`prisma-client-js`) e o modo novo com driver adapters
- Como um JWT é gerado, assinado e verificado, e como montar um middleware de autenticação no Fastify
- Modelagem de relação 1:N no Prisma e o cuidado de manter dados sensíveis (como senha) fora de qualquer resposta da API, usando `select`
- A matemática por trás de paginação (`skip`/`take`, `Math.ceil` para calcular o total de páginas) — um padrão que se repete em qualquer stack, não só Prisma
- Diferença entre validação de formato (Zod) e regra de negócio (checagem no banco), e por que as duas são necessárias
- Debug de problemas reais de CORS (preflight bloqueando `PATCH`) e de erros de tipagem em runtime vs. compile-time

## Como rodar

### Backend

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Cria um `.env` na raiz com:
```
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
```

O servidor sobe em `http://localhost:4000`.

### Front-end de apoio

```bash
cd frontend
npm install
npm run dev
```

Cria um `.env` dentro da pasta do front com:
```
VITE_API_URL=http://localhost:4000
```

Abre em `http://localhost:5173`.

### Popular o banco com dados de teste (opcional)

```bash
node --env-file=.env prisma/seed.js 30
```

## Screenshots

### Front-end de apoio

**Tela de cadastro**
<img width="1866" height="948" alt="Tela de cadastro" src="https://github.com/user-attachments/assets/b19d9497-2467-4fcc-8e50-1dcae4191255" />

### API (Insomnia)

**Rota protegida, com token válido**
<img width="1422" height="800" alt="Requisição autenticada com sucesso" src="https://github.com/user-attachments/assets/f771fd95-91a3-452f-808a-bce3978615ce" />

**Rota protegida, sem token**
<img width="1429" height="799" alt="Requisição sem token retornando erro" src="https://github.com/user-attachments/assets/95f5ffd3-0ad2-4eac-884d-77e4c3fb47e2" />

### Banco de dados

**Tabelas `users` e `customers`**, conectadas pela coluna `userId`
<img width="1464" height="496" alt="Tabelas relacionadas no banco" src="https://github.com/user-attachments/assets/6dac687b-abb4-43d1-bab5-77722cb377ed" />

---

Projeto de estudo — feedback é sempre bem-vindo.
