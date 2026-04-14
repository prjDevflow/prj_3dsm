# 1000 Valle Multimarcas — Backend API

> Backend do sistema corporativo de gestão de leads e negociações automotivas da **1000 Valle Multimarcas**.  
> Projeto ABP — FATEC Jacareí.

---

## Sumário

- [Tecnologias](#-tecnologias-utilizadas)
- [Arquitetura e Padrões de Projeto](#-arquitetura-e-padrões-de-projeto)
- [Requisitos Funcionais](#-requisitos-funcionais-implementados)
- [Como Executar](#-como-executar-o-projeto)
- [Referência de Comandos](#-referência-de-comandos)
- [Documentação da API (Swagger)](#-documentação-interativa-da-api-swagger)
- [Testes Automatizados](#-testes-automatizados)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Plataforma & Linguagem** | Node.js com TypeScript |
| **Framework Web** | Express.js |
| **ORM** | Prisma |
| **Banco de Dados** | PostgreSQL |
| **Segurança** | JWT (JSON Web Tokens) + `bcryptjs` |
| **Documentação** | Swagger (OpenAPI) |
| **Testes** | Jest & Supertest |

---

## Arquitetura e Padrões de Projeto

O sistema foi arquitetado utilizando os princípios **SOLID** com separação de responsabilidades em camadas **Controller → Service → Repository**.

### 1. Repository Pattern
Utilizado em classes como `LeadsRepository` e `NegotiationsRepository`.

- **O que faz:** Isola completamente a camada de regra de negócio (Services) do acesso a dados.
- **Vantagem:** Trocar o Prisma por outro ORM ou mudar de banco de dados afeta apenas os Repositórios — o restante do sistema permanece intacto.

### 2. Singleton Pattern
Implementado na conexão com o banco de dados (`const prisma = new PrismaClient()`).

- **O que faz:** Garante uma única instância de conexão com o banco durante o ciclo de vida do servidor.
- **Vantagem:** Evita esgotamento do pool de conexões (*Too Many Connections*) com o PostgreSQL.

### 3. Service Layer / Command Pattern
Aplicado nas classes da pasta `services` (ex: `CreateNegotiationService`).

- **O que faz:** Cada Service possui **uma única responsabilidade** (SRP) e expõe apenas um método público `execute()`.
- **Vantagem:** Facilita reutilização e testes. O Service valida as regras de negócio (ex: bloquear segunda negociação ativa — RF03) antes de acionar o Repositório.

### 4. Middleware Pattern / Chain of Responsibility
Aplicado em `ensureAuthenticated`, `ensureRole` e `validateRequest`.

- **O que faz:** Intercepta requisições HTTP antes de chegarem ao Controller.
- **Vantagem:** Centraliza extração do token JWT, injeção de dados do utilizador (`req.user.id`) e o Controlo de Acesso Baseado em Papéis (RBAC). Rotas restritas barram requisições não autorizadas imediatamente.

### 5. DTO (Data Transfer Object)
Utilizado em interfaces como `ICreateLeadRequest` e `ICreateNegotiationRequest`, com validação via `schemas.ts`.

- **O que faz:** Modela e valida estritamente os dados que transitam entre o Controller e o Service.
- **Vantagem:** Impede que dados indesejados cheguem ao banco, protegendo a integridade da aplicação.

### 6. Dependency Injection
Abstrações de repositório (ex: `INegotiationsRepository`) permitem a injeção de repositórios em memória durante testes unitários, desacoplando o código da infraestrutura.

---

## Requisitos Funcionais Implementados

| Requisito | Descrição | Status |
| :--- | :--- | :---: |
| **RF01** | Autenticação segura via JWT. | ✅ |
| **RF02** | RBAC — Admin, Gerente e Atendente. O Atendente vê apenas seus próprios Leads; o Gerente, os da equipa. | ✅ |
| **RF03** | Funil de Vendas: bloqueio de mais de uma negociação **Ativa** por Lead; histórico automático de mudanças de estágio. | ✅ |
| **RF04/05** | Dashboard inteligente com filtros de data rigorosos (máx. 30 dias para base; 1 ano para Admins). | ✅ |
| **RF07** | Tabela de Auditoria — logs automáticos registados passivamente na camada de Service. | ✅ |

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js v18+
- PostgreSQL configurado e acessível

### 1. Instalação e Configuração

```bash
# Instale as dependências
npm install
```

Crie o ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/abp_1000valle?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
```

### 2. Banco de Dados

```bash
# Aplica o esquema (DDL) na base de dados
npm run prisma:migrate

# Popula com dados iniciais obrigatórios (Origens, Estágios, Status e Admin)
npm run prisma:seed
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

---

## Referência de Comandos

### Testes

| Comando | Descrição |
| :--- | :--- |
| `npm test` | Inicia o Jest e executa a bateria completa de testes de integração (`.spec.ts`). |

> **Atenção:** Para que os testes de integração funcionem corretamente, o servidor (`npm run dev`) deve estar rodando em paralelo e a base de dados deve conter os dados do seed.

### Servidor

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor em modo de desenvolvimento com **Hot Reload** via `ts-node-dev`. |
| `npm run build` | Compila o TypeScript para JavaScript otimizado na pasta `dist/`. |
| `npm start` | Executa o código compilado (`dist/`) com o Node nativo. Indicado para **produção**. |

### Banco de Dados (Prisma)

| Comando | Descrição |
| :--- | :--- |
| `npm run prisma:migrate` | Lê o `schema.prisma` e aplica as alterações no PostgreSQL (cria/atualiza tabelas). |
| `npm run prisma:seed` | Popula a base com dados obrigatórios: Papéis, Origens, Estágios, Status e o utilizador Admin. |

---

## Documentação Interativa da API (Swagger)

A API possui documentação completa e interativa construída com **Swagger (OpenAPI)**, configurada em `src/docs/swagger.json`.

A interface permite que qualquer membro da equipa — especialmente o Front-end — explore todos os endpoints, valide os formatos de entrada e saída (DTOs) e teste requisições diretamente pelo navegador.

### Como acessar

1. Certifique-se de que o servidor está rodando (`npm run dev`).
2. Acesse no navegador:

```
http://localhost:3333/api-docs
```

### Funcionalidades

- **Testes autenticados em tempo real:** Faça o login via `POST /sessions`, copie o token retornado e cole no botão **🔒 Authorize** no topo da página. A partir daí, todas as rotas protegidas por JWT podem ser testadas diretamente na interface.
- **Contratos claros:** O Swagger define exatamente quais campos são obrigatórios (ex: `importancia`, `estagio` para Negociações) e quais os códigos HTTP de resposta esperados (`200`, `201`, `400`, `401`, `500`), reduzindo erros de integração entre Front-end e Back-end.

---

## Testes Automatizados

A suíte de testes de integração (`src/tests/FullSystem.spec.ts`) valida o fluxo completo da aplicação de ponta a ponta. Os testes são executados em sequência e cada etapa depende dos resultados da anterior.

### Fluxo da Suíte de Testes

**1. Login como Admin e recebimento do Token JWT**

Simula o fluxo de autenticação com `POST /sessions`. Valida o hash da senha (bcrypt) e confirma o retorno do Token JWT com `Status 200`. O token é armazenado e utilizado como passaporte em todos os testes seguintes.

---

**2. Identificar uma loja existente na base**

Acessa diretamente o banco via Prisma para localizar a primeira Loja registada. É um teste de *setup* que garante que o seed foi executado com sucesso e armazena o ID da Loja para uso posterior.

---

**3. Criar um novo cliente via API**

Envia `POST /clientes` com um e-mail único gerado via `Date.now()` (ex: `teste123456@email.com`), garantindo idempotência em múltiplas execuções. Valida o retorno de `Status 201 Created` e o UUID do novo cliente.

---

**4. Criar um Lead para o cliente recém-criado**

Junta os dados dos passos anteriores e envia `POST /leads` com o ID do Cliente, ID da Loja e o nome de uma Origem (ex: `"WhatsApp"`). Valida a resolução de chaves estrangeiras complexas e a **Busca Inteligente**, que aceita tanto nome quanto UUID como identificador de origem.

---

**5. Abrir a primeira negociação para o Lead**

Usa o ID do Lead criado e envia `POST /leads/negotiations` para iniciar a tratativa comercial no estágio *"Contato Inicial"*. Valida que os status e estágios padrão são associados corretamente.

---

**6. Bloquear uma segunda negociação aberta para o mesmo Lead (RF03)**

O **Teste de Ouro** da suíte. Tenta criar propositadamente uma segunda negociação para o mesmo Lead do teste anterior. Valida que a camada de Service é intransigente: intercepta a ação, bloqueia a gravação e retorna `400 Bad Request`.

---

**7. Listar os logs e confirmar as ações anteriores (RF07)**

Envia `GET /logs` com o token de Admin. Valida o comportamento passivo do sistema de auditoria: mesmo sem serem testes sobre logs, as ações dos passos 3, 4 e 5 devem ter gerado registos automaticamente via `CreateLogService`.

---

**8. Retornar as métricas do Dashboard (RF04/RF05)**

Simula a abertura da página inicial com `GET /dashboard`. Valida as consultas analíticas de conversão de leads, agrupamentos por status e os filtros rigorosos de data via `DateValidator`, confirmando `Status 200 OK` sem sobrecarga.

---

## Estrutura do Projeto

O projeto segue uma arquitetura modular onde cada domínio da aplicação (`auth`, `clientes`, `leads`, `dashboard`, `logs`) está encapsulado dentro de `src/modules`, isolando responsabilidades e facilitando a manutenção.

```text
├── jest.config.ts
├── jest.setup.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations
│       ├── migration_lock.toml
│       └── 20260413231753_init_db
│           └── migration.sql
└── src
    ├── docs
    │   └── swagger.json                         # Configuração da documentação OpenAPI
    ├── domain
    │   └── models                               # Modelos de domínio (entidades puras)
    │       ├── Lead.ts
    │       ├── Log.ts
    │       ├── Negotiation.ts
    │       ├── User.ts
    │       └── UserRole.ts
    ├── modules
    │   ├── auth                                 # Autenticação e gestão de utilizadores
    │   │   ├── controllers
    │   │   │   └── AuthenticateUserController.ts
    │   │   ├── infra/http/routes
    │   │   │   └── auth.routes.ts
    │   │   ├── repositories
    │   │   │   └── UsersRepository.ts
    │   │   └── services
    │   │       ├── AuthService.ts
    │   │       └── CreateUserService.ts
    │   ├── clientes                             # Registo de clientes
    │   │   └── controllers
    │   │       └── CreateClienteController.ts
    │   ├── dashboard                            # Métricas e análise (RF04/RF05)
    │   │   ├── controllers
    │   │   │   └── DashboardController.ts
    │   │   ├── infra/http/routes
    │   │   │   └── dashboard.routes.ts
    │   │   └── services
    │   │       └── DashboardService.ts
    │   ├── leads                                # Funil de Vendas (RF02/RF03)
    │   │   ├── controllers
    │   │   │   ├── CreateLeadController.ts
    │   │   │   ├── CreateNegotiationController.ts
    │   │   │   ├── ListLeadsController.ts
    │   │   │   └── UpdateNegotiationController.ts
    │   │   ├── infra/http/routes
    │   │   │   └── leads.routes.ts
    │   │   ├── repositories
    │   │   │   ├── INegotiationsRepository.ts   # Interface para Injeção de Dependência
    │   │   │   ├── LeadsRepository.ts
    │   │   │   └── NegotiationsRepository.ts
    │   │   └── services
    │   │       ├── CreateLeadService.ts
    │   │       ├── CreateNegotiationService.ts
    │   │       ├── ListLeadsService.ts
    │   │       └── UpdateNegotiationService.ts
    │   ├── logs                                 # Auditoria passiva (RF07)
    │   │   ├── controllers
    │   │   │   └── ListLogsController.ts
    │   │   ├── repositories
    │   │   │   └── LogsRepository.ts
    │   │   └── services
    │   │       ├── CreateLogService.ts
    │   │       └── ListLogsService.ts
    │   ├── lojas                                # Gestão de lojas
    │   │   └── controllers
    │   │       └── CreateLojaController.ts
    │   └── origens                              # Origens dos Leads (WhatsApp, etc.)
    │       └── controllers
    │           └── CreateOrigemController.ts
    ├── shared
    │   ├── errors
    │   │   └── AppError.ts                      # Classe de erros padronizados
    │   ├── infra/http
    │   │   ├── middlewares
    │   │   │   ├── ensureAuthenticated.ts       # Validação do token JWT
    │   │   │   ├── ensureRole.ts                # Controlo de Acesso (RBAC)
    │   │   │   └── validateRequest.ts           # Validação de DTOs via schemas
    │   │   ├── routes
    │   │   │   ├── index.ts
    │   │   │   ├── leads.routes.ts
    │   │   │   └── logs.routes.ts
    │   │   ├── server.ts
    │   │   └── validators
    │   │       └── schemas.ts                   # Schemas de validação de entrada
    │   └── utils
    │       └── DateValidator.ts                 # Validador de intervalos de datas (RF04/RF05)
    ├── tests
    │   └── FullSystem.spec.ts                   # Suíte de testes de integração E2E
    └── @types
        └── express
            └── index.d.ts                       # Extensão do tipo Request (req.user)
```

---
