# RULES.md

## 0. Objetivo

Construir um sistema simples de vendas/caixa com:

- Next.js (App Router)
- Server Actions (atuando como “backend”)
- Postgres (Neon)
- Segurança e consistência de dados como prioridade

Cenário: 1 caixa, baixo volume. Mesmo assim, as regras abaixo devem ser seguidas como se fossem serviços separados.

---

## 1. Arquitetura obrigatória

### 1.1 Separação lógica “Front” vs “Server”

Mesmo estando no mesmo projeto, tratar como se fossem dois servidores:

- O **Front** só conversa com o **Server** via “requests” internas (Server Actions/Route Handlers)
- O **Server** valida tudo e conversa com o banco
- O **Front não acessa o banco** de forma alguma (nem SDK de banco no client)

Fluxo:
Client UI -> Hook (client) -> chamada para Server Action/Route Handler -> valida JWT -> regras de negócio -> transação no DB -> resposta

---

## 2. Regras de arquivos e funções (MUITO IMPORTANTE)

### 2.1 Um arquivo = uma função

- Cada arquivo deve exportar **apenas uma função** (default ou named export, mas só uma).
- Constantes auxiliares devem estar em arquivos próprios (cada arquivo com uma função utilitária) ou em `constants.ts` (apenas constantes, sem funções).

Exemplos de padrão:

- `app/actions/sales/createSale.ts` exporta somente `createSale`
- `app/actions/sales/listSales.ts` exporta somente `listSales`
- `app/lib/auth/verifyJwt.ts` exporta somente `verifyJwt`
- `app/lib/db/withTx.ts` exporta somente `withTx`

### 2.2 Lógicas no Front devem estar em Hooks

- Toda lógica de UI (fetch, state, loading, retry, optimistic update, transformação de payload) deve ficar em **hooks**.
- Componentes devem ser “burros”: só renderizam e chamam handlers do hook.

Obrigatório:

- `useCreateSale()`, `useOpenCashbox()`, `useCreateSangria()`, `useListSales()`, etc.

Proibido:

- Colocar fetch/chamada de action diretamente dentro do componente sem passar por hook
- Colocar validações complexas no componente

---

## 3. Autenticação obrigatória (JWT + Cookies)

### 3.1 Modelo de autenticação

Mesmo com auth completo no projeto, a comunicação Front -> Server deve ser por **JWT**, como se fosse API externa.

- O Server emite um **JWT** após login
- O Front salva o token em **cookie**
- Toda request do Front para Server deve enviar o token via cookie
- O Server deve validar JWT em todas as ações protegidas

### 3.2 Cookies (regras)

- O token deve ser armazenado em cookie com:
  - `HttpOnly` (sempre que possível)
  - `Secure` em produção
  - `SameSite=Lax` (ou `Strict` se não houver necessidade de cross-site)
  - `Path=/`
- Evitar expor token ao JavaScript do browser. Preferir cookie HttpOnly.
- Se precisar de refresh token:
  - refresh token também em cookie HttpOnly
  - access token curto (ex: 15 min) e refresh mais longo

### 3.3 Validação obrigatória no Server

Toda ação/handler protegido deve:

1. Extrair JWT do cookie
2. Verificar assinatura e expiração
3. Validar claims mínimos (ex: `sub`, `role`, `iat`, `exp`)
4. Rejeitar se inválido/ausente (401)

Proibido:

- Confiar em payload vindo do client sem validar JWT
- Aceitar `userId` do client como fonte de verdade (sempre usar `sub` do JWT)

---

## 4. Server Actions e/ou Route Handlers

### 4.1 Padrão de chamada

- Hooks no client chamam Server Actions (ou Route Handlers) sempre com payload validado.
- O Server deve revalidar tudo via Zod (ver seção 5).

### 4.2 Não expor dados sensíveis

- Nunca retornar dados sensíveis no response (ex: segredo, claims completas, connection info).
- Retornar apenas o necessário para a UI.

---

## 5. Validação (Zod obrigatório)

- Toda entrada no Server deve ser validada com Zod.
- Nenhuma action/handler pode aceitar `any`.
- Validar shape e limites (min/max) para evitar payloads indevidos.

---

## 6. Consistência e transações (OBRIGATÓRIO)

### 6.1 Transação para operações de caixa/venda

Qualquer operação que envolva:

- criar venda
- criar itens da venda
- atualizar caixa (totais)
- sangria
- abertura/fechamento

DEVE rodar em transação (BEGIN/COMMIT/ROLLBACK).

Proibido:

- Inserir venda e itens fora de transação
- Atualizar caixa fora da mesma transação da venda/sangria

### 6.2 Inserts em lote

- Itens da venda (15 itens) devem ser inseridos em batch (createMany/INSERT multi-values).

---

## 7. Banco de dados (Neon Postgres)

### 7.1 Regras de acesso

- Conexão ao banco somente no Server (nunca no client).
- Connection string apenas em env server-side.
- Preferir pooler/driver compatível com serverless.

### 7.2 Modelagem (guidelines)

- IDs: UUID
- Timestamps: `createdAt`, `updatedAt`
- Soft delete: `deletedAt` (quando aplicável)
- Caixa fechado é imutável (após fechamento, nada altera registros do período — corrigir via lançamentos/ajustes, não editando o passado).

---

## 8. Testes (CRÍTICO): 100% no backend

### 8.1 Definição de “backend” aqui

Backend inclui:

- Server Actions
- Route Handlers
- Services server-side
- Funções de auth (JWT verify/sign)
- Acesso ao DB (camada de repositório/queries)
- Validadores server-side

### 8.2 Meta

- Cobertura 100% (lines/branches/functions/statements) em toda a camada backend definida acima.

### 8.3 Regras de teste

- Testes devem cobrir:
  - happy path
  - validação (inputs inválidos)
  - auth (sem token, token inválido, token expirado)
  - autorização (role/permissão quando existir)
  - transação (rollback em falha)
  - idempotência quando aplicável
- Tests devem usar:
  - DB de teste isolado (schema separado ou banco separado)
  - migrations rodadas antes dos testes
  - limpeza entre testes (truncate) para determinismo

Proibido:

- “Mockar tudo” e não testar queries/transações
- Depender de dados residuais

---

## 9. Padrões de código

- TypeScript strict ligado
- Proibido `any`
- Erros devem ser tratados e padronizados (ex: `AppError` com code/status)
- Logs somente no server e nunca com dados sensíveis

---

## 10. Organização de pastas (sugestão obrigatória)

- app/actions/\*\*: server actions por domínio
- app/api/\*\*: route handlers se necessário
- app/hooks/\*\*: hooks de UI (client)
- app/lib/auth/\*\*: jwt, cookies, guards
- app/lib/db/\*\*: conexão, helpers de transação, queries
- app/lib/validators/\*\*: schemas zod (um arquivo por schema, um export por arquivo)
- tests/\*\*: testes do backend

Regras:

- Hooks sempre em `app/hooks`
- Actions sempre em `app/actions`
- Cada arquivo, uma função (seção 2)

---

## 11. Regra de ouro

Se for possível:

- criar venda sem token
- alterar caixa de outro usuário/turno
- gravar dados inconsistentes (venda sem itens ou caixa desatualizado)

Então a implementação está errada.
