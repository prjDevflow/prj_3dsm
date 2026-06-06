# Banco de Dados — Fonte da Verdade do Schema

Este documento explica **por que existem duas representações do schema** no projeto e
**como mantê-las consistentes** (rubrica 3.8 — persistência e ORM).

## Fonte canônica: Prisma

A definição oficial do banco é o **Prisma**:

- [`BACKEND/prisma/schema.prisma`](../BACKEND/prisma/schema.prisma) — o modelo das entidades.
- [`BACKEND/prisma/migrations/`](../BACKEND/prisma/migrations/) — o **histórico versionado** da estrutura (DDL).

Toda alteração de estrutura deve ser feita **no `schema.prisma` + uma migration** (`npx prisma migrate dev`).
Os arquivos SQL desta pasta **não** são a fonte da verdade.

## Por que existem SQLs nesta pasta?

O container do PostgreSQL (definido em [`Dockerfile`](./Dockerfile)) precisa subir com a
estrutura **e** com dados de demonstração já carregados de um CSV. Os scripts em
`/docker-entrypoint-initdb.d` rodam **uma única vez**, na primeira inicialização do banco,
em ordem alfabética:

| Ordem | Arquivo | Papel |
|:---:|---|---|
| 1 | [`01_schema.sql`](./01_schema.sql) | Cria as **tabelas base** (idêntico ao que as primeiras migrations do Prisma criariam). |
| 2 | [`02_mark_migrations.sql`](./02_mark_migrations.sql) | Marca essas migrations como já aplicadas em `_prisma_migrations`, para o backend não tentar recriá-las. |
| 3 | [`03_import_csv.sql`](./03_import_csv.sql) | Importa os dados fictícios do dashboard a partir do CSV. |

Em seguida, o container do **backend** (em [`BACKEND/entrypoint.sh`](../BACKEND/entrypoint.sh))
roda `npx prisma migrate deploy`, que aplica **as migrations restantes** (as que não foram
marcadas no passo 2 — ex.: lembretes, NPS, capabilities, permissões) sobre o schema base.

```
db (init)            : 01_schema → 02_mark_migrations → 03_import_csv (dados demo)
backend (entrypoint) : prisma migrate deploy (migrations restantes) → seed → start
```

O CSV precisa das tabelas já existentes no momento do init do banco (antes do backend subir);
por isso o schema base é criado via SQL, e não apenas via `migrate deploy`.

## Regra de manutenção (evitar drift)

Ao criar uma nova migration no Prisma:

- **Se ela apenas ADICIONA** estruturas (tabelas/colunas novas): **nada a fazer aqui** — o
  `prisma migrate deploy` do backend a aplicará automaticamente sobre o schema base.
- **Se ela ALTERA uma tabela base** já criada por `01_schema.sql`: atualize `01_schema.sql`
  (e, se necessário, `02_mark_migrations.sql`) para manter o SQL de init coerente com o Prisma,
  evitando conflito de "objeto já existe" no `migrate deploy`.

> 💡 Alternativa de simplificação (futura): mover a carga do CSV para o `prisma/seed.ts` e
> deixar o Prisma como **única** fonte (eliminando `01`/`02`). Não foi feito para não alterar
> o fluxo de `docker compose up` validado.
