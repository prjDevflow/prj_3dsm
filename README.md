#  DevFlow - Sistema de Gestão de Leads

**Uma plataforma web para gestão de leads e análise de desempenho comercial, desenvolvida para a 1000 Valle Multimarcas.**

[![LICENSE](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://choosealicense.com/licenses/mit/)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20PostgreSQL-blue)](https://github.com/seu-usuario/prj_3dsm)

##  Tabela de Conteúdos

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Product Backlog](#-product-backlog)

## Sobre o Projeto

O **DevFlow** é uma plataforma desenvolvida para centralizar, gerenciar e analisar leads comerciais da **1000 Valle Multimarcas**, revendedora de veículos com múltiplas unidades, em parceria com a **FATEC Jacareí**.

A plataforma integra dados de diferentes canais de captação:
- **Canais Presenciais:** Visitas em loja e contato telefônico
- **Canais Digitais:** WhatsApp, Instagram, formulários digitais e outros meios de captação

## Funcionalidades

- **👤 Controle de Acesso:** Autenticação com JWT e perfis hierárquicos (Atendente, Gerente, Gerente Geral e Administrador)
- **📋 Gestão de Leads:** Registro, acompanhamento e evolução de negociações
- **📊 Dashboard Operacional:** Visualize leads por status, origem, loja e importância
- **📈 Dashboard Analítico:** Analise taxas de conversão, desempenho por atendente e equipe
- **🔍 Filtros Temporais:** Filtre dados por semana, mês, ano ou período customizado
- **🗂️ Logs de Auditoria:** Registro completo de operações e acessos do sistema

## 🛠 Tecnologias Utilizadas

### Front-End
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Back-End
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Banco de Dados
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Infraestrutura
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

##  Product Backlog

<details>
<summary><b>RF01 — Autenticação de Usuários</b></summary>

**Como** usuário do sistema  
**Quero** autenticar com e-mail e senha  
**Para que** eu possa acessar o sistema com segurança e ter minhas permissões reconhecidas.

**Critérios de Aceitação**
- O sistema permite login via e-mail e senha.
- A autenticação gera um token JWT contendo identificador do usuário, papel (role) e tempo de expiração.
- Rotas protegidas rejeitam requisições sem token válido.
- Todos os usuários podem atualizar seu próprio e-mail e senha.
- Senhas são armazenadas com hash seguro (bcrypt ou equivalente).
</details>

<details>
<summary><b>RF02 — Controle de Acesso Baseado em Papéis (RBAC)</b></summary>

**Como** administrador do sistema  
**Quero** que cada perfil de usuário tenha permissões específicas  
**Para que** o acesso aos dados e funcionalidades seja controlado de forma hierárquica e segura.

**Critérios de Aceitação**
- O sistema implementa os perfis: Atendente, Gerente, Gerente Geral e Administrador.
- Atendente visualiza e gerencia apenas seus próprios leads.
- Gerente visualiza e gerencia leads de toda a sua equipe.
- Gerente Geral visualiza dados consolidados de todas as equipes.
- Administrador possui acesso total ao sistema, incluindo logs.
- Todas as regras de autorização são aplicadas exclusivamente no backend.
</details>

<details>
<summary><b>RF03 — Gestão de Negociações</b></summary>

**Como** atendente  
**Quero** criar e gerenciar negociações vinculadas aos meus leads  
**Para que** eu possa acompanhar a evolução de cada oportunidade comercial.

**Critérios de Aceitação**
- É possível criar uma negociação vinculada a um lead.
- A negociação possui campo de importância (frio, morno, quente).
- A negociação pode estar aberta ou encerrada.
- O sistema registra histórico de alterações de status e estágio.
- Cada lead pode possuir no máximo uma negociação ativa.
</details>

<details>
<summary><b>RF04 — Dashboard Operacional</b></summary>

**Como** usuário do sistema  
**Quero** visualizar um painel com os principais indicadores operacionais de leads  
**Para que** eu possa acompanhar o volume e a distribuição dos atendimentos em andamento.

**Critérios de Aceitação**
- O dashboard exibe total de leads, leads por status, por origem, por loja e por importância.
- O filtro padrão exibe dados dos últimos 30 dias.
- Os dados são atualizados de acordo com o perfil do usuário autenticado.
- A interface é responsiva e de navegação intuitiva.
</details>

<details>
<summary><b>RF05 — Dashboard Analítico</b></summary>

**Como** gerente ou administrador  
**Quero** visualizar indicadores analíticos de desempenho e conversão  
**Para que** eu possa avaliar a eficiência da equipe e tomar decisões estratégicas.

**Critérios de Aceitação**
- O dashboard exibe taxa de conversão (leads convertidos ÷ total de leads finalizados).
- Exibe comparativo de leads convertidos vs não convertidos.
- Exibe leads por atendente, por equipe e distribuição por importância.
- Exibe motivos de finalização e tempo médio até atendimento.
- Os dados respeitam o escopo de acesso do perfil autenticado.
</details>

<details>
<summary><b>RF06 — Filtros Temporais</b></summary>

**Como** usuário do sistema  
**Quero** filtrar os dados dos dashboards por período  
**Para que** eu possa analisar informações em diferentes intervalos de tempo.

**Critérios de Aceitação**
- O sistema oferece filtros por semana, mês, ano e período customizado.
- Usuários não administradores têm limite máximo de 1 ano no período consultado.
- Administradores não possuem limitação de período.
- A validação do período ocorre no backend.
</details>

<details>
<summary><b>RF07 — Logs de Acesso e Operações</b></summary>

**Como** administrador  
**Quero** visualizar logs completos de acesso e operações realizadas no sistema  
**Para que** eu possa auditar ações, identificar inconsistências e garantir a rastreabilidade dos dados.

**Critérios de Aceitação**
- O sistema registra login de usuários.
- São registradas operações de criação, atualização e exclusão de clientes, usuários, times, leads e negociações.
- Cada log armazena data, hora e usuário responsável pela operação.
- Apenas o Administrador tem acesso à visualização completa dos logs.
</details>

#  UML

## Diagrama de Casos de Uso
<img height="1000" alt="Diagrama de Casos de Uso" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/UML-Casos_De_Uso.png" />

## Diagrama de Classes
<img height="400" alt="Diagrama de Classes" src="https://github.com/prjDevflow/prj_3dsm/blob/main/imagens/UML-Classe.png" />

## Sprint 1 — Planejamento (Poker Planning)

### Estimativa de Tarefas e Story Points

| #  | Item                                                                               | Pontos | Status      |
| -- | ---------------------------------------------------------------------------------- | ------ | ----------- |
| 1  | [FE] Página de Login                                                               | 3      | ✅ Concluído |
| 2  | [FE] Página Dashboard <br> + Filtros (por nível de permissão)                      | 8      | ✅ Concluído |
| 3  | [FE] Página Leads <br> + Filtros (por nível de permissão)                          | 8      | ✅ Concluído |
| 4  | [FE] Página Configuração                                                           | 3      | ✅ Concluído |
| 5  | [FE] Página Usuários                                                               | 5      | ✅ Concluído |
| 6  | [FE] Página Equipes                                                                | 5      | ✅ Concluído |
| 7  | [FE] Página Logs                                                                   | 3      | ✅ Concluído |
| 8  | [BE] RF01 – Autenticação com JWT <br> + Bcrypt (expiração 1 dia)                   | 5      | ✅ Concluído |
| 9  | [BE] RF02 – RBAC: controle de acesso <br> por perfil nos filtros e dashboard       | 8      | ✅ Concluído |
| 10 | [BE] RF06 – Filtros Temporais <br> com DateValidator (limite 12 meses)             | 3      | ✅ Concluído |
| 11 | [BE] Infraestrutura: Camadas <br> Controller/Service/Repository <br> + Middlewares | 5      | ✅ Concluído |
| 12 | [BE] Documentação inicial <br> via Swagger                                         | 2      | ✅ Concluído |
|    | **Total**                                                                          | **58** |             |

### Burndown Chart

