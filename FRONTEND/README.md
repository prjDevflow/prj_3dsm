
# 📊 AnalyticsPro - Sistema de Gestão de Leads

Dashboard analítico profissional para gestão de leads, negociações, equipes e usuários, desenvolvido com React + TypeScript.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)



## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Perfis de Acesso](#perfis-de-acesso)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Credenciais de Teste](#credenciais-de-teste)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Próximos Passos](#próximos-passos)
- [Licença](#licença)



## 🎯 Sobre o Projeto

O **AnalyticsPro** é um sistema completo de gestão de leads desenvolvido para o desafio da FATEC. O projeto contempla:

- Autenticação com 4 perfis hierárquicos (Atendente, Gerente, Gerente Geral, Administrador)
- Dashboard analítico com gráficos interativos e filtros temporais
- Gestão completa de leads, negociações, equipes e usuários
- Logs detalhados de todas as ações do sistema
- Interface moderna, responsiva e acessível



## ✨ Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha (JWT mock)
- Logout
- Atualização de perfil (e-mail e senha)

### 📊 Dashboard
- KPIs em tempo real (total de leads, conversões, ticket médio, receita)
- Gráficos interativos (linha, barra, pizza)
- Filtros por período (semana, mês, ano, customizado)
- Filtros por loja e equipe
- Dashboards específicos por perfil de usuário

### 👥 Leads
- Listagem paginada com busca por nome/e-mail
- Filtros por status e importância
- Visualização de detalhes do lead
- Histórico completo de negociações
- Adicionar/encerrar negociações (respeitando regra de uma ativa por lead)

### 👤 Usuários (Admin)
- Listagem com paginação e busca
- Criar, editar, ativar/desativar e excluir usuários
- Atribuir papéis (atendente, gerente, gerente geral, admin)
- Vincular a equipes

### 👥 Equipes (Admin/Gerente)
- Listagem em cards com métricas
- Criar, editar e excluir equipes
- Gerenciar membros da equipe
- Visualizar métricas da equipe (leads, conversões, top performers)

### 📝 Logs (Admin)
- Histórico completo de ações (login, logout, criações, atualizações, exclusões)
- Filtros por usuário, ação, tipo de entidade e período
- Exportação para CSV



## 👑 Perfis de Acesso

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|-------------|
| **Atendente** | `atendente@email.com` | `123456` | Ver/editar apenas seus leads, adicionar negociações, ver dashboard pessoal |
| **Gerente** | `gerente@email.com` | `123456` | Ver leads da equipe, gerenciar equipes, dashboard da equipe |
| **Gerente Geral** | `gerente_geral@email.com` | `123456` | Visualizar dados consolidados de todas as equipes, dashboard global |
| **Administrador** | `admin@email.com` | `123456` | Acesso total (usuários, equipes, logs, configurações) |


## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18.2.0 | Biblioteca principal |
| TypeScript | 5.2.2 | Tipagem estática |
| Vite | 5.2.0 | Build tool |
| Tailwind CSS | 3.4.1 | Estilização |
| React Router DOM | 6.22.3 | Roteamento |
| React Query | 5.18.0 | Gerenciamento de estado e cache |
| Axios | 1.6.8 | Cliente HTTP |
| Recharts | 2.12.4 | Gráficos |
| Lucide React | 0.363.0 | Ícones |
| date-fns | 3.6.0 | Manipulação de datas |
| MSW | 2.2.13 | Mock de API |
| Jest | 29.7.0 | Testes unitários |



## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── charts/          # Gráficos interativos
│   ├── Header.tsx       # Barra de navegação
│   ├── KpiCard.tsx      # Cards de indicadores
│   ├── LeadsTable.tsx   # Tabela de leads
│   ├── ProtectedRoute.tsx # Proteção de rotas
│   └── Toast.tsx        # Notificações
│
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Tela de login
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Leads.tsx        # Lista de leads
│   ├── LeadDetail.tsx   # Detalhe do lead
│   ├── Profile.tsx      # Perfil do usuário
│   ├── Settings.tsx     # Configurações
│   ├── Users.tsx        # CRUD de usuários
│   ├── Teams.tsx        # CRUD de equipes
│   └── Logs.tsx         # Visualização de logs
│
├── hooks/               # Hooks customizados
│   ├── useLeads.ts      # Busca de leads
│   ├── useDashboardMetrics.ts # Métricas do dashboard
│   ├── useUsers.ts      # CRUD de usuários
│   ├── useTeams.ts      # CRUD de equipes
│   └── useLogs.ts       # Busca de logs
│
├── services/            # Serviços e APIs
│   ├── api.ts           # Configuração do Axios
│   ├── mockServer.ts    # Mocks do MSW
│   ├── logService.ts    # Registro de logs
│   └── logEventService.ts # Eventos de logs
│
├── context/             # Contextos React
│   ├── AuthContext.tsx  # Autenticação
│   └── ToastContext.tsx # Notificações
│
├── types/               # Tipagens TypeScript
│   └── index.ts         # Interfaces (User, Lead, Team, Log...)
│
├── styles/              # Estilos globais
│   └── index.css        # Tailwind + CSS customizado
│
├── utils/               # Funções utilitárias
│   └── dateUtils.ts     # Validação de datas
│
├── mocks/               # Dados mockados
│   └── mockLeadsData.ts # 1000 leads para testes
│
├── App.tsx              # Componente principal
└── main.tsx             # Ponto de entrada
```


## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/analyticspro-frontend.git
cd analyticspro-frontend

# 2. Instale as dependências
npm install

# 3. Execute o projeto (com mocks)
npm run start:mock

# 4. Acesse no navegador
http://localhost:3000
```

---

## 🔑 Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Atendente | `atendente@email.com` | `123456` |
| Gerente | `gerente@email.com` | `123456` |
| Gerente Geral | `gerente_geral@email.com` | `123456` |
| Administrador | `admin@email.com` | `123456` |

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (sem MSW) |
| `npm run start:mock` | Inicia servidor com MSW ativo (recomendado) |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza build localmente |
| `npm run test` | Executa testes unitários |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |

---

## 🔮 Próximos Passos

- [ ] Integração com backend real (Node.js + PostgreSQL)
- [ ] Autenticação JWT real com refresh token
- [ ] WebSockets para atualizações em tempo real
- [ ] Testes automatizados completos (unitários + e2e)
- [ ] Deploy na Vercel/Netlify
- [ ] Docker para containerização completa

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## 👨‍💻 Autor

Desenvolvido como parte do desafio de frontend da FATEC.

---

## 🙏 Agradecimentos

- Professores e orientadores do curso de DSM
- Comunidade open source pelas ferramentas incríveis

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
```


