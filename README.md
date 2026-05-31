<div align="center">

<img src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/UML-Casos.png" alt="banner" width="0" height="0" />

# DevFlow — Sistema de Gestão de Leads

**Plataforma web para centralização, gestão e análise de leads comerciais**  
Desenvolvido para a **1000 Valle Multimarcas** em parceria com a **FATEC Jacareí**

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Trello](https://img.shields.io/badge/Trello-Board-0052CC?logo=trello&logoColor=white)](https://trello.com/b/TtUCzMT8/3dsm-abpsprint-1)

</div>

---

## Sobre o Projeto

O **DevFlow** é uma plataforma desenvolvida para centralizar, gerenciar e analisar os leads comerciais da **1000 Valle Multimarcas**, revendedora de veículos com múltiplas unidades.

O sistema integra dados de diferentes canais de captação — presenciais e digitais — em uma única interface, oferecendo visibilidade total do funil de vendas para todos os níveis hierárquicos da empresa.

---

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Controle de Acesso** | Autenticação JWT com perfis hierárquicos: Atendente, Gerente, Gerente Geral e Administrador |
| **Gestão de Leads** | Registro, acompanhamento e evolução de leads por status e importância |
| **Negociações** | Ciclo completo de negociação com histórico de estágios e motivo de encerramento |
| **Dashboard Operacional** | Leads por status, origem, loja e importância com filtros temporais |
| **Dashboard Analítico** | Taxa de conversão, desempenho por atendente e equipe, funil de vendas |
| **Filtros Temporais** | Semana, mês, ano ou período customizado com validação por perfil |
| **Logs de Auditoria** | Registro completo de acessos e operações com rastreabilidade total |

---

## Stack Tecnológica

<div align="center">

### Front-End
![React](https://skillicons.dev/icons?i=react)&nbsp;
![TypeScript](https://skillicons.dev/icons?i=ts)&nbsp;
![Vite](https://skillicons.dev/icons?i=vite)&nbsp;
![TailwindCSS](https://skillicons.dev/icons?i=tailwind)

### Back-End
![Node.js](https://skillicons.dev/icons?i=nodejs)&nbsp;
![Express](https://skillicons.dev/icons?i=express)&nbsp;
![TypeScript](https://skillicons.dev/icons?i=ts)

### Banco de Dados & ORM
![PostgreSQL](https://skillicons.dev/icons?i=postgresql)&nbsp;
![Prisma](https://skillicons.dev/icons?i=prisma)

### Infraestrutura
![Docker](https://skillicons.dev/icons?i=docker)

</div>

---

## Requisitos Funcionais

<details>
<summary><b>RF01 — Autenticação de Usuários</b></summary>
<br>

**Como** usuário do sistema  
**Quero** autenticar com e-mail e senha  
**Para que** eu possa acessar o sistema com segurança e ter minhas permissões reconhecidas.

**Critérios de Aceitação**
- O sistema permite login via e-mail e senha
- A autenticação gera um token JWT com identificador do usuário, papel e tempo de expiração
- Rotas protegidas rejeitam requisições sem token válido
- Todos os usuários podem atualizar seu próprio e-mail e senha
- Senhas são armazenadas com hash seguro (bcrypt)

</details>

<details>
<summary><b>RF02 — Controle de Acesso Baseado em Papéis (RBAC)</b></summary>
<br>

**Como** administrador do sistema  
**Quero** que cada perfil tenha permissões específicas  
**Para que** o acesso aos dados seja controlado de forma hierárquica e segura.

**Critérios de Aceitação**
- Perfis implementados: Atendente, Gerente, Gerente Geral e Administrador
- Atendente visualiza e gerencia apenas seus próprios leads
- Gerente visualiza e gerencia leads de toda a sua equipe
- Gerente Geral visualiza dados consolidados de todas as equipes
- Administrador possui acesso total, incluindo logs
- Todas as regras de autorização são aplicadas exclusivamente no backend

</details>

<details>
<summary><b>RF03 — Gestão de Negociações</b></summary>
<br>

**Como** atendente  
**Quero** criar e gerenciar negociações vinculadas aos meus leads  
**Para que** eu possa acompanhar a evolução de cada oportunidade comercial.

**Critérios de Aceitação**
- É possível criar uma negociação vinculada a um lead
- A negociação possui campo de importância (frio, morno, quente)
- A negociação pode estar aberta ou encerrada
- O sistema registra histórico de alterações de status e estágio
- Cada lead pode possuir no máximo uma negociação ativa por vez

</details>

<details>
<summary><b>RF04 — Dashboard Operacional</b></summary>
<br>

**Como** usuário do sistema  
**Quero** visualizar um painel com os principais indicadores operacionais  
**Para que** eu possa acompanhar o volume e a distribuição dos atendimentos.

**Critérios de Aceitação**
- Exibe total de leads por status, origem, loja e importância
- Filtro padrão de 30 dias aplicado automaticamente
- Dados atualizados conforme o perfil do usuário autenticado
- Interface responsiva e de navegação intuitiva

</details>

<details>
<summary><b>RF05 — Dashboard Analítico</b></summary>
<br>

**Como** gerente ou administrador  
**Quero** visualizar indicadores analíticos de desempenho e conversão  
**Para que** eu possa avaliar a eficiência da equipe e tomar decisões estratégicas.

**Critérios de Aceitação**
- Exibe taxa de conversão (leads convertidos ÷ total de leads finalizados)
- Exibe comparativo de leads convertidos vs não convertidos
- Exibe leads por atendente, por equipe e distribuição por importância
- Exibe motivos de finalização e tempo médio até atendimento
- Dados respeitam o escopo de acesso do perfil autenticado

</details>

<details>
<summary><b>RF06 — Filtros Temporais</b></summary>
<br>

**Como** usuário do sistema  
**Quero** filtrar os dados dos dashboards por período  
**Para que** eu possa analisar informações em diferentes intervalos de tempo.

**Critérios de Aceitação**
- Filtros disponíveis: semana, mês, ano e período customizado
- Usuários não administradores têm limite máximo de 1 ano no período
- Administradores não possuem limitação de período
- Validação do período ocorre no backend

</details>

<details>
<summary><b>RF07 — Logs de Acesso e Operações</b></summary>
<br>

**Como** administrador  
**Quero** visualizar logs completos de acesso e operações realizadas  
**Para que** eu possa auditar ações e garantir a rastreabilidade dos dados.

**Critérios de Aceitação**
- O sistema registra login de usuários
- São registradas operações de criação, atualização e exclusão de clientes, usuários, times, leads e negociações
- Cada log armazena data, hora e usuário responsável
- Apenas o Administrador tem acesso à visualização completa dos logs

</details>

---

## Modelagem UML

### Diagrama de Casos de Uso
<img alt="Diagrama de Casos de Uso" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/UML-Casos.png" />

### Diagrama de Classes
<img alt="Diagrama de Classes" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/UML-Classe.png" />

### Diagramas de Sequência

<details>
<summary>Autenticação de Usuário</summary>
<br>
<img alt="Diagrama de Sequência — Autenticação" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/autenticacao.png" />
</details>

<details>
<summary>Criação de Lead</summary>
<br>
<img alt="Diagrama de Sequência — Lead" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/lead.png" />
</details>

<details>
<summary>Atualizar Estágio da Negociação</summary>
<br>
<img alt="Diagrama de Sequência — Estágio" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/estagio.png" />
</details>

<details>
<summary>Visualizar Dashboard (Gerente)</summary>
<br>
<img alt="Diagrama de Sequência — Dashboard" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/dashboard.png" />
</details>

<details>
<summary>Visualizar Logs (Administrador)</summary>
<br>
<img alt="Diagrama de Sequência — Logs" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/logs.png" />
</details>

---

## Sprints

### Sprint 1 — Poker Planning

| # | Item | Pontos | Status |
|---|------|:------:|--------|
| 1 | [FE] Página de Login | 3 | ✅ Concluído |
| 2 | [FE] Página Dashboard + Filtros por permissão | 8 | ✅ Concluído |
| 3 | [FE] Página Leads + Filtros por permissão | 8 | ✅ Concluído |
| 4 | [FE] Página Configuração | 3 | ✅ Concluído |
| 5 | [FE] Página Usuários | 5 | ✅ Concluído |
| 6 | [FE] Página Equipes | 5 | ✅ Concluído |
| 7 | [FE] Página Logs | 3 | ✅ Concluído |
| 8 | [BE] RF01 — Autenticação com JWT + Bcrypt | 5 | ✅ Concluído |
| 9 | [BE] RF02 — RBAC: controle de acesso por perfil | 8 | ✅ Concluído |
| 10 | [BE] RF06 — Filtros Temporais com DateValidator | 3 | ✅ Concluído |
| 11 | [BE] Infraestrutura: Controller/Service/Repository + Middlewares | 5 | ✅ Concluído |
| 12 | [BE] Documentação inicial via Swagger | 2 | ✅ Concluído |
| | **Total** | **58** | |

<img alt="Burndown Sprint 1" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/burndown_sprint1.png" />

---

### Sprint 2 — Poker Planning

| # | Item | Pontos | Status |
|---|------|:------:|--------|
| 1 | Remover limitação/barreira de espaço | 5 | ✅ Concluído |
| 2 | Ampliar fontes para melhor visualização | 3 | ✅ Concluído |
| 3 | Ajustar responsividade para diferentes dispositivos | 5 | ✅ Concluído |
| 4 | Aplicar filtros padrão (7, 15, 30 e 60 dias) | 3 | ✅ Concluído |
| 5 | Melhorar visibilidade geral da interface | 5 | ✅ Concluído |
| 6 | Criar Dockerfile para o backend | 8 | ✅ Concluído |
| 7 | Criar docker-compose.yml com serviços: postgres, backend e frontend | 5 | ✅ Concluído |
| 8 | Criar seletor de período (última semana, mês, ano e personalizado) | 5 | ✅ Concluído |
| 9 | Implementar Date Picker para período customizado | 3 | ✅ Concluído |
| 10 | Atualizar gráficos dinamicamente | 5 | ✅ Concluído |
| 11 | Salvar preferência de filtros no LocalStorage | 3 | ✅ Concluído |
| 12 | Adicionar tooltips e informações detalhadas nos gráficos | 5 | ✅ Concluído |
| | **Total** | **55** | |

<img alt="Burndown Sprint 2" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/burndown_sprint2.png" />

---

<div align="center">

Desenvolvido com dedicação pela equipe **DevFlow** · FATEC Jacareí · 2025–2026

</div>
