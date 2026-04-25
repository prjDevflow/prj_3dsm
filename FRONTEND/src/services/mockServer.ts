import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// ==================== MOCK DE LEADS ====================
// Datas de 2026, distribuídas nos últimos 4 meses para os filtros funcionarem
let mockLeads = [
  // Janeiro 2026
  { id: '1',  name: 'Empresa Alpha',    email: 'contato@alpha.com',    phone: '(11) 99999-1111', status: 'novo',        importance: 'alta',  origin: 'Site',       store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z' },
  { id: '2',  name: 'Beta Corp',        email: 'vendas@beta.com',      phone: '(21) 98888-2222', status: 'contatado',   importance: 'media', origin: 'Indicação',  store: 'loja2', teamId: '1', assignedTo: '2', createdAt: '2026-01-12T14:30:00Z', updatedAt: '2026-01-13T09:15:00Z' },
  { id: '3',  name: 'Gama Ltda',        email: 'financeiro@gama.com',  phone: '(31) 97777-3333', status: 'qualificado', importance: 'alta',  origin: 'Google Ads', store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-01-18T08:20:00Z', updatedAt: '2026-01-19T11:40:00Z' },
  { id: '4',  name: 'Delta SA',         email: 'comercial@delta.com',  phone: '(41) 96666-4444', status: 'perdido',     importance: 'baixa', origin: 'Facebook',   store: 'loja3', teamId: '2', assignedTo: '3', createdAt: '2026-01-25T16:45:00Z', updatedAt: '2026-01-28T12:00:00Z', lossReason: 'Preço' },
  { id: '5',  name: 'Omega Tech',       email: 'propostas@omega.com',  phone: '(51) 95555-5555', status: 'ganho',       importance: 'alta',  origin: 'Evento',     store: 'loja2', teamId: '1', assignedTo: '2', createdAt: '2026-02-02T09:00:00Z', updatedAt: '2026-02-15T17:30:00Z' },
  // Fevereiro 2026
  { id: '6',  name: 'Sigma Solutions',  email: 'contato@sigma.com',    phone: '(61) 94444-6666', status: 'novo',        importance: 'media', origin: 'LinkedIn',   store: 'loja1', teamId: '1', assignedTo: '7', createdAt: '2026-02-08T11:20:00Z', updatedAt: '2026-02-08T11:20:00Z' },
  { id: '7',  name: 'Theta Industria',  email: 'vendas@theta.com',     phone: '(71) 93333-7777', status: 'contatado',   importance: 'alta',  origin: 'Google Ads', store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-02-14T13:45:00Z', updatedAt: '2026-02-15T10:30:00Z' },
  { id: '8',  name: 'Labs Digital',     email: 'contato@labs.com',     phone: '(81) 92222-8888', status: 'qualificado', importance: 'baixa', origin: 'Site',       store: 'loja3', teamId: '2', assignedTo: '3', createdAt: '2026-02-20T09:15:00Z', updatedAt: '2026-02-21T16:20:00Z' },
  { id: '9',  name: 'Tech Solutions',   email: 'comercial@tech.com',   phone: '(91) 91111-9999', status: 'perdido',     importance: 'alta',  origin: 'Facebook',   store: 'loja2', teamId: '1', assignedTo: '2', createdAt: '2026-02-25T14:30:00Z', updatedAt: '2026-02-27T14:30:00Z', lossReason: 'Concorrência' },
  { id: '10', name: 'Inova Sistemas',   email: 'propostas@inova.com',  phone: '(31) 90000-1111', status: 'perdido',     importance: 'media', origin: 'Facebook',   store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-03-02T10:00:00Z', updatedAt: '2026-03-04T17:45:00Z', lossReason: 'Preço' },
  // Março 2026
  { id: '11', name: 'Nexus Corp',       email: 'contato@nexus.com',    phone: '(11) 98888-3333', status: 'novo',        importance: 'baixa', origin: 'Site',       store: 'loja2', teamId: '2', assignedTo: '3', createdAt: '2026-03-08T16:00:00Z', updatedAt: '2026-03-08T16:00:00Z' },
  { id: '12', name: 'Prime Solutions',  email: 'vendas@prime.com',     phone: '(21) 97777-4444', status: 'contatado',   importance: 'alta',  origin: 'Google Ads', store: 'loja2', teamId: '1', assignedTo: '2', createdAt: '2026-03-15T11:30:00Z', updatedAt: '2026-03-16T09:15:00Z' },
  { id: '13', name: 'Vertex Group',     email: 'contato@vertex.com',   phone: '(31) 96666-5555', status: 'ganho',       importance: 'alta',  origin: 'Indicação',  store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-22T15:00:00Z' },
  { id: '14', name: 'Pulse Tecnologia', email: 'contato@pulse.com',    phone: '(41) 95555-6666', status: 'qualificado', importance: 'alta',  origin: 'Site',       store: 'loja3', teamId: '2', assignedTo: '3', createdAt: '2026-03-27T14:00:00Z', updatedAt: '2026-03-28T10:00:00Z' },
  { id: '15', name: 'Aero Consultoria', email: 'vendas@aero.com',      phone: '(51) 94444-7777', status: 'perdido',     importance: 'media', origin: 'LinkedIn',   store: 'loja2', teamId: '1', assignedTo: '7', createdAt: '2026-03-30T09:00:00Z', updatedAt: '2026-04-01T11:00:00Z', lossReason: 'Prazo' },
  // Abril 2026 (últimos 30 dias)
  { id: '16', name: 'Orbital Systems',  email: 'contato@orbital.com',  phone: '(61) 93333-8888', status: 'contatado',   importance: 'media', origin: 'Google Ads', store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-04-02T08:30:00Z', updatedAt: '2026-04-03T09:00:00Z' },
  { id: '17', name: 'Grid Soluções',    email: 'contato@grid.com',     phone: '(71) 92222-9999', status: 'novo',        importance: 'baixa', origin: 'Site',       store: 'loja3', teamId: '2', assignedTo: '3', createdAt: '2026-04-07T13:00:00Z', updatedAt: '2026-04-07T13:00:00Z' },
  { id: '18', name: 'Apex Digital',     email: 'contato@apex.com',     phone: '(81) 91111-0000', status: 'ganho',       importance: 'alta',  origin: 'Evento',     store: 'loja2', teamId: '2', assignedTo: '3', createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-12T16:00:00Z' },
  { id: '19', name: 'Flux Partners',    email: 'contato@flux.com',     phone: '(91) 90000-1111', status: 'qualificado', importance: 'alta',  origin: 'Indicação',  store: 'loja1', teamId: '1', assignedTo: '2', createdAt: '2026-04-14T11:00:00Z', updatedAt: '2026-04-15T14:00:00Z' },
  // Últimos 7 dias (18-25 de abril)
  { id: '20', name: 'Nova Ventures',    email: 'contato@nova.com',     phone: '(11) 99999-2222', status: 'novo',        importance: 'media', origin: 'Site',       store: 'loja1', teamId: '1', assignedTo: '7', createdAt: '2026-04-18T09:00:00Z', updatedAt: '2026-04-18T09:00:00Z' },
  { id: '21', name: 'Core Analytics',   email: 'contato@core.com',     phone: '(21) 98888-3333', status: 'contatado',   importance: 'alta',  origin: 'Google Ads', store: 'loja2', teamId: '1', assignedTo: '1', createdAt: '2026-04-20T14:00:00Z', updatedAt: '2026-04-21T10:00:00Z' },
  { id: '22', name: 'Sky Inovações',    email: 'contato@sky.com',      phone: '(31) 97777-4444', status: 'novo',        importance: 'baixa', origin: 'Facebook',   store: 'loja3', teamId: '2', assignedTo: '3', createdAt: '2026-04-22T16:00:00Z', updatedAt: '2026-04-22T16:00:00Z' },
  { id: '23', name: 'Macro Sistemas',   email: 'contato@macro.com',    phone: '(41) 96666-5555', status: 'perdido',     importance: 'media', origin: 'LinkedIn',   store: 'loja2', teamId: '1', assignedTo: '2', createdAt: '2026-04-23T10:00:00Z', updatedAt: '2026-04-23T15:00:00Z', lossReason: 'Concorrência' },
  { id: '24', name: 'Zeta Commerce',    email: 'contato@zeta.com',     phone: '(51) 95555-6666', status: 'ganho',       importance: 'alta',  origin: 'Site',       store: 'loja1', teamId: '1', assignedTo: '1', createdAt: '2026-04-24T08:00:00Z', updatedAt: '2026-04-24T18:00:00Z' },
  { id: '25', name: 'Linx Tecnologia',  email: 'contato@linx.com',     phone: '(61) 94444-7777', status: 'novo',        importance: 'alta',  origin: 'Indicação',  store: 'loja2', teamId: '2', assignedTo: '3', createdAt: '2026-04-25T09:00:00Z', updatedAt: '2026-04-25T09:00:00Z' },
];

// ==================== MOCK DE NEGOCIAÇÕES ====================
let mockNegotiations = [
  { id: '1', leadId: '1', userId: '1', content: 'Primeiro contato feito por email. Cliente demonstrou interesse em saber mais sobre nossos serviços.', type: 'comentário', importance: 'morno', stage: 'primeiro_contato', status: 'encerrada', createdAt: '2026-01-05T11:00:00Z', updatedAt: '2026-01-05T11:00:00Z', closedAt: '2026-01-06T09:00:00Z', closedReason: 'Lead qualificado' },
  { id: '2', leadId: '1', userId: '1', content: 'Enviada proposta comercial com desconto de 10% para fechamento trimestral.', type: 'proposta', importance: 'quente', stage: 'proposta_enviada', status: 'encerrada', createdAt: '2026-01-06T09:30:00Z', updatedAt: '2026-01-06T09:30:00Z', closedAt: '2026-01-07T14:00:00Z', closedReason: 'Aguardando resposta' },
  { id: '3', leadId: '1', userId: '2', content: 'Cliente pediu alterações na proposta. Ajustes enviados.', type: 'comentário', importance: 'quente', stage: 'negociacao', status: 'ativa', createdAt: '2026-01-07T14:15:00Z', updatedAt: '2026-01-07T14:15:00Z' },
  { id: '4', leadId: '3', userId: '3', content: 'Demonstração agendada para próxima terça-feira às 14h.', type: 'contato', importance: 'morno', stage: 'qualificacao', status: 'encerrada', createdAt: '2026-01-19T14:00:00Z', updatedAt: '2026-01-19T14:00:00Z', closedAt: '2026-01-20T10:00:00Z' },
  { id: '5', leadId: '3', userId: '3', content: 'Demonstração realizada. Cliente muito interessado no módulo de relatórios.', type: 'comentário', importance: 'quente', stage: 'qualificacao', status: 'encerrada', createdAt: '2026-01-20T15:30:00Z', updatedAt: '2026-01-20T15:30:00Z' },
  { id: '6', leadId: '3', userId: '1', content: 'Enviada proposta personalizada com foco em relatórios automatizados.', type: 'proposta', importance: 'quente', stage: 'proposta_enviada', status: 'ativa', createdAt: '2026-01-21T10:45:00Z', updatedAt: '2026-01-21T10:45:00Z' },
  { id: '7', leadId: '5', userId: '1', content: 'Lead qualificado. Passar para negociação comercial.', type: 'comentário', importance: 'morno', stage: 'qualificacao', status: 'encerrada', createdAt: '2026-02-03T09:00:00Z', updatedAt: '2026-02-03T09:00:00Z' },
  { id: '8', leadId: '5', userId: '1', content: 'Contrato assinado! Cliente optou pelo plano anual.', type: 'comentário', importance: 'quente', stage: 'fechamento', status: 'encerrada', createdAt: '2026-02-15T17:30:00Z', updatedAt: '2026-02-15T17:30:00Z' },
];

// ==================== MOCK DE CLIENTES ====================
let mockClients = [
  { id: '1', name: 'Carlos Mendes',   email: 'carlos@email.com',   phone: '(11) 99999-0001', cpf: '123.456.789-00', leadId: '5',  leadName: 'Omega Tech',    assignedTo: '2', createdAt: '2026-02-15T18:00:00Z', updatedAt: '2026-02-15T18:00:00Z' },
  { id: '2', name: 'Fernanda Lima',   email: 'fernanda@email.com', phone: '(21) 98888-0002', cpf: '234.567.890-11', leadId: '13', leadName: 'Vertex Group',  assignedTo: '1', createdAt: '2026-03-22T16:00:00Z', updatedAt: '2026-03-22T16:00:00Z' },
  { id: '3', name: 'Ricardo Alves',   email: 'ricardo@email.com',  phone: '(31) 97777-0003', cpf: '345.678.901-22', leadId: '18', leadName: 'Apex Digital',  assignedTo: '3', createdAt: '2026-04-12T17:00:00Z', updatedAt: '2026-04-12T17:00:00Z' },
  { id: '4', name: 'Beatriz Souza',   email: 'beatriz@email.com',  phone: '(41) 96666-0004', cpf: '456.789.012-33', leadId: '24', leadName: 'Zeta Commerce', assignedTo: '1', createdAt: '2026-04-24T18:30:00Z', updatedAt: '2026-04-24T18:30:00Z' },
];

// ==================== MOCK DE USUÁRIOS ====================
let mockUsers = [
  { id: '1',  name: 'João Silva',        email: 'joao.silva@email.com',    role: 'atendente',    teamId: '1', active: true, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: '2',  name: 'Maria Santos',      email: 'maria.santos@email.com',  role: 'atendente',    teamId: '1', active: true, createdAt: '2026-01-20T14:30:00Z', updatedAt: '2026-01-20T14:30:00Z' },
  { id: '3',  name: 'Pedro Oliveira',    email: 'pedro.oliveira@email.com',role: 'atendente',    teamId: '2', active: true, createdAt: '2026-02-01T09:15:00Z', updatedAt: '2026-02-01T09:15:00Z' },
  { id: '4',  name: 'Ana Costa',         email: 'ana.costa@email.com',     role: 'gerente',      teamId: '1', active: true, createdAt: '2026-01-10T11:00:00Z', updatedAt: '2026-01-10T11:00:00Z' },
  { id: '5',  name: 'Carlos Souza',      email: 'carlos.souza@email.com',  role: 'gerente',      teamId: '2', active: true, createdAt: '2026-01-12T16:45:00Z', updatedAt: '2026-01-12T16:45:00Z' },
  { id: '6',  name: 'Admin User',        email: 'admin@email.com',         role: 'admin',        teamId: null, active: true, createdAt: '2026-01-01T08:00:00Z', updatedAt: '2026-01-01T08:00:00Z' },
  { id: '7',  name: 'Atendente Teste',   email: 'atendente@email.com',     role: 'atendente',    teamId: '1', active: true, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: '8',  name: 'Gerente Teste',     email: 'gerente@email.com',       role: 'gerente',      teamId: '2', active: true, createdAt: '2026-01-10T11:00:00Z', updatedAt: '2026-01-10T11:00:00Z' },
  { id: '9',  name: 'Gerente Geral Teste',email:'gerente_geral@email.com', role: 'gerente_geral',teamId: undefined, active: true, createdAt: '2026-01-01T08:00:00Z', updatedAt: '2026-01-01T08:00:00Z' },
];

// ==================== MOCK DE EQUIPES ====================
let mockTeams = [
  { id: '1', name: 'Vendas Centro', description: 'Equipe responsável pela loja do centro', managerId: '4', members: ['1', '2', '7'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: '2', name: 'Vendas Norte',  description: 'Equipe responsável pela loja norte',    managerId: '5', members: ['3', '8'],      createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

// ==================== MAPEAMENTOS ====================
const storeNameMap: Record<string, string> = {
  loja1: 'Loja Centro',
  loja2: 'Loja Norte',
  loja3: 'Loja Sul',
};

const teamNameMap: Record<string, string> = {
  '1': 'Vendas Centro',
  '2': 'Vendas Norte',
};

const agentNameMap: Record<string, string> = {
  '1': 'João',
  '2': 'Maria',
  '3': 'Pedro',
  '7': 'Atendente',
};

// ==================== COMPUTAÇÃO DINÂMICA DE MÉTRICAS ====================
function computeMetrics(
  leads: typeof mockLeads,
  startDateStr: string | null,
  endDateStr: string | null
) {
  // Filtrar por data comparando só a parte YYYY-MM-DD (sem timezone)
  let filtered = [...leads];
  if (startDateStr) {
    const startDay = startDateStr.split('T')[0];
    filtered = filtered.filter(l => l.createdAt.split('T')[0] >= startDay);
  }
  if (endDateStr) {
    const endDay = endDateStr.split('T')[0];
    filtered = filtered.filter(l => l.createdAt.split('T')[0] <= endDay);
  }

  // KPIs
  const totalLeads = filtered.length;
  const convertedLeads = filtered.filter(l => l.status === 'ganho').length;
  const lostLeads = filtered.filter(l => l.status === 'perdido').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 1000) / 10 : 0;
  const avgDealValue = 15000;
  const totalRevenue = convertedLeads * avgDealValue;

  // Funil de vendas
  const funnel = [
    { stage: 'Novo',        count: filtered.filter(l => l.status === 'novo').length },
    { stage: 'Contatado',   count: filtered.filter(l => l.status === 'contatado').length },
    { stage: 'Qualificado', count: filtered.filter(l => l.status === 'qualificado').length },
    { stage: 'Ganho',       count: convertedLeads },
  ].filter(s => s.count > 0);

  // Por origem
  const sourceMap: Record<string, number> = {};
  filtered.forEach(l => { sourceMap[l.origin] = (sourceMap[l.origin] || 0) + 1; });
  const bySource = Object.entries(sourceMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Por status
  const byStatus = [
    { status: 'novo',        count: filtered.filter(l => l.status === 'novo').length },
    { status: 'contatado',   count: filtered.filter(l => l.status === 'contatado').length },
    { status: 'qualificado', count: filtered.filter(l => l.status === 'qualificado').length },
    { status: 'perdido',     count: lostLeads },
    { status: 'ganho',       count: convertedLeads },
  ].filter(s => s.count > 0);

  // Por importância
  const importanceMap: Record<string, number> = {};
  filtered.forEach(l => { importanceMap[l.importance] = (importanceMap[l.importance] || 0) + 1; });
  const byImportance = Object.entries(importanceMap)
    .map(([importance, count]) => ({ importance, count }));

  // Por loja
  const storeCountMap: Record<string, number> = {};
  filtered.forEach(l => {
    if (l.store) {
      const name = storeNameMap[l.store] || l.store;
      storeCountMap[name] = (storeCountMap[name] || 0) + 1;
    }
  });
  const byStore = Object.entries(storeCountMap)
    .map(([store, count]) => ({ store, count }))
    .sort((a, b) => b.count - a.count);

  // Por equipe
  const teamCountMap: Record<string, number> = {};
  filtered.forEach(l => {
    if (l.teamId) {
      const name = teamNameMap[l.teamId] || l.teamId;
      teamCountMap[name] = (teamCountMap[name] || 0) + 1;
    }
  });
  const byTeam = Object.entries(teamCountMap)
    .map(([team, count]) => ({ team, count }));

  // Convertidos vs não convertidos
  const convertedVsNonConverted = [
    { name: 'Convertidos',     value: convertedLeads },
    { name: 'Não Convertidos', value: totalLeads - convertedLeads },
  ].filter(i => i.value > 0);

  // Evolução temporal (agrupamento dinâmico)
  const rangeStart = startDateStr
    ? new Date(startDateStr.split('T')[0] + 'T00:00:00Z')
    : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })();
  const rangeEnd = endDateStr
    ? new Date(endDateStr.split('T')[0] + 'T23:59:59Z')
    : new Date();

  const daysDiff = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
  const evolution: { date: string; leads: number; conversions: number }[] = [];

  if (daysDiff <= 31) {
    // Agrupamento diário
    const d = new Date(rangeStart);
    while (d <= rangeEnd) {
      const dayStr = d.toISOString().split('T')[0];
      const dayLeads = filtered.filter(l => l.createdAt.split('T')[0] === dayStr);
      evolution.push({
        date: `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`,
        leads: dayLeads.length,
        conversions: dayLeads.filter(l => l.status === 'ganho').length,
      });
      d.setUTCDate(d.getUTCDate() + 1);
    }
  } else if (daysDiff <= 90) {
    // Agrupamento semanal
    const d = new Date(rangeStart);
    // Alinhar ao início da semana (segunda-feira)
    const dow = d.getUTCDay();
    const offset = dow === 0 ? -6 : 1 - dow;
    d.setUTCDate(d.getUTCDate() + offset);

    while (d <= rangeEnd) {
      const weekStart = new Date(d);
      const weekEnd = new Date(d);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      weekEnd.setUTCHours(23, 59, 59, 999);

      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekEndStr   = weekEnd.toISOString().split('T')[0];
      const weekLeads = filtered.filter(l => {
        const ld = l.createdAt.split('T')[0];
        return ld >= weekStartStr && ld <= weekEndStr;
      });
      evolution.push({
        date: `${String(weekStart.getUTCDate()).padStart(2, '0')}/${String(weekStart.getUTCMonth() + 1).padStart(2, '0')}`,
        leads: weekLeads.length,
        conversions: weekLeads.filter(l => l.status === 'ganho').length,
      });
      d.setUTCDate(d.getUTCDate() + 7);
    }
  } else {
    // Agrupamento mensal
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const d = new Date(Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), 1));
    while (d <= rangeEnd) {
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth();
      const monthStartStr = `${y}-${String(m + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      const monthEndStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const monthLeads = filtered.filter(l => {
        const ld = l.createdAt.split('T')[0];
        return ld >= monthStartStr && ld <= monthEndStr;
      });
      evolution.push({
        date: `${monthNames[m]}/${String(y).slice(2)}`,
        leads: monthLeads.length,
        conversions: monthLeads.filter(l => l.status === 'ganho').length,
      });
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
  }

  // Performance por atendente
  const agentStatsMap: Record<string, { leads: number; conversions: number }> = {};
  filtered.forEach(l => {
    const id = l.assignedTo || 'outros';
    if (!agentStatsMap[id]) agentStatsMap[id] = { leads: 0, conversions: 0 };
    agentStatsMap[id].leads++;
    if (l.status === 'ganho') agentStatsMap[id].conversions++;
  });
  const performance = Object.entries(agentStatsMap)
    .filter(([, s]) => s.leads > 0)
    .map(([id, s]) => ({ agent: agentNameMap[id] || id, ...s }));

  // Motivos de perda/encerramento
  const lossReasonMap: Record<string, number> = {};
  filtered
    .filter(l => l.status === 'perdido')
    .forEach(l => {
      const reason = (l as any).lossReason || 'Outros';
      lossReasonMap[reason] = (lossReasonMap[reason] || 0) + 1;
    });
  const lossReasons = Object.entries(lossReasonMap)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);

  // Tempo médio de atendimento (mock fixo)
  const avgTimeToFirstContact = totalLeads > 0 ? '2 dias' : 'N/A';

  return {
    kpis: { totalLeads, convertedLeads, conversionRate, avgDealValue, totalRevenue },
    funnel: funnel.length > 0 ? funnel : [{ stage: 'Sem dados', count: 0 }],
    bySource,
    byStatus,
    byImportance,
    byStore,
    convertedVsNonConverted: convertedVsNonConverted.length > 0 ? convertedVsNonConverted : [{ name: 'Sem dados', value: 0 }],
    byTeam,
    avgTimeToFirstContact,
    evolution: evolution.length > 0 ? evolution : [{ date: '-', leads: 0, conversions: 0 }],
    performance,
    lossReasons,
  };
}

// ==================== MOCK DE LOGS ====================
const mockLogs = [
  { id: '1',  userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'login',  entityType: 'user',         entityId: '6', entityName: 'Admin User',        details: 'Login realizado com sucesso',                    ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-04-25T08:00:00Z' },
  { id: '2',  userId: '8', userName: 'Gerente Teste',     userEmail: 'gerente@email.com',        action: 'login',  entityType: 'user',         entityId: '8', entityName: 'Gerente Teste',     details: 'Login realizado com sucesso',                    ipAddress: '192.168.1.11', userAgent: 'Chrome/124', createdAt: '2026-04-25T08:15:00Z' },
  { id: '3',  userId: '7', userName: 'Atendente Teste',   userEmail: 'atendente@email.com',      action: 'login',  entityType: 'user',         entityId: '7', entityName: 'Atendente Teste',   details: 'Login realizado com sucesso',                    ipAddress: '192.168.1.12', userAgent: 'Firefox/125', createdAt: '2026-04-24T09:00:00Z' },
  { id: '4',  userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'lead',         entityId: '24', entityName: 'Zeta Commerce',    details: 'Lead criado com status: ganho',                  ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-04-24T08:00:00Z' },
  { id: '5',  userId: '1', userName: 'João Silva',        userEmail: 'joao.silva@email.com',     action: 'update', entityType: 'lead',         entityId: '21', entityName: 'Core Analytics',   details: 'Status alterado para: contatado',                ipAddress: '192.168.1.13', userAgent: 'Chrome/124', createdAt: '2026-04-21T10:00:00Z' },
  { id: '6',  userId: '3', userName: 'Pedro Oliveira',    userEmail: 'pedro.oliveira@email.com', action: 'create', entityType: 'negotiation',  entityId: 'n1', entityName: 'Lead: Apex Digital', details: 'Negociação criada (tipo: proposta)',             ipAddress: '192.168.1.14', userAgent: 'Safari/17',  createdAt: '2026-04-12T14:00:00Z' },
  { id: '7',  userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'login',  entityType: 'user',         entityId: '6', entityName: 'Admin User',        details: 'Login realizado com sucesso',                    ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-04-10T07:45:00Z' },
  { id: '8',  userId: '2', userName: 'Maria Santos',      userEmail: 'maria.santos@email.com',   action: 'create', entityType: 'lead',         entityId: '19', entityName: 'Flux Partners',    details: 'Lead criado com status: qualificado',            ipAddress: '192.168.1.15', userAgent: 'Chrome/124', createdAt: '2026-04-14T11:00:00Z' },
  { id: '9',  userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'user',         entityId: '7', entityName: 'Atendente Teste',   details: 'Usuário criado com perfil: atendente',           ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-01-15T10:00:00Z' },
  { id: '10', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'user',         entityId: '8', entityName: 'Gerente Teste',     details: 'Usuário criado com perfil: gerente',             ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-01-10T11:00:00Z' },
  { id: '11', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'team',         entityId: '1', entityName: 'Vendas Centro',     details: 'Equipe criada com 0 membros',                    ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-01-01T08:00:00Z' },
  { id: '12', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'team',         entityId: '2', entityName: 'Vendas Norte',      details: 'Equipe criada com 0 membros',                    ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-01-01T08:05:00Z' },
  { id: '13', userId: '1', userName: 'João Silva',        userEmail: 'joao.silva@email.com',     action: 'create', entityType: 'lead',         entityId: '13', entityName: 'Vertex Group',     details: 'Lead criado com status: ganho',                  ipAddress: '192.168.1.13', userAgent: 'Chrome/124', createdAt: '2026-03-20T10:00:00Z' },
  { id: '14', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'update', entityType: 'team',         entityId: '1', entityName: 'Vendas Centro',     details: 'Membros atualizados: 3 membros',                 ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-03-01T09:00:00Z' },
  { id: '15', userId: '2', userName: 'Maria Santos',      userEmail: 'maria.santos@email.com',   action: 'update', entityType: 'negotiation',  entityId: 'n2', entityName: 'Lead: Omega Tech', details: 'Negociação encerrada (motivo: Contrato assinado)', ipAddress: '192.168.1.15', userAgent: 'Chrome/124', createdAt: '2026-02-15T17:30:00Z' },
  { id: '16', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'update', entityType: 'user',         entityId: '2', entityName: 'Maria Santos',      details: 'Email atualizado',                               ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-02-10T09:00:00Z' },
  { id: '17', userId: '3', userName: 'Pedro Oliveira',    userEmail: 'pedro.oliveira@email.com', action: 'create', entityType: 'lead',         entityId: '11', entityName: 'Nexus Corp',       details: 'Lead criado com status: novo',                   ipAddress: '192.168.1.14', userAgent: 'Safari/17',  createdAt: '2026-03-08T16:00:00Z' },
  { id: '18', userId: '2', userName: 'Maria Santos',      userEmail: 'maria.santos@email.com',   action: 'create', entityType: 'lead',         entityId: '5', entityName: 'Omega Tech',        details: 'Lead criado com status: ganho',                  ipAddress: '192.168.1.15', userAgent: 'Chrome/124', createdAt: '2026-02-02T09:00:00Z' },
  { id: '19', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'delete', entityType: 'user',         entityId: 'x1', entityName: 'Usuário Teste',    details: 'Usuário removido do sistema',                    ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-03-15T11:00:00Z' },
  { id: '20', userId: '1', userName: 'João Silva',        userEmail: 'joao.silva@email.com',     action: 'update', entityType: 'lead',         entityId: '7', entityName: 'Theta Industria',   details: 'Status alterado para: contatado',                ipAddress: '192.168.1.13', userAgent: 'Chrome/124', createdAt: '2026-02-15T10:30:00Z' },
  { id: '21', userId: '9', userName: 'Gerente Geral Teste', userEmail: 'gerente_geral@email.com', action: 'login', entityType: 'user',        entityId: '9', entityName: 'Gerente Geral Teste', details: 'Login realizado com sucesso',                   ipAddress: '192.168.1.20', userAgent: 'Edge/124',   createdAt: '2026-04-22T08:30:00Z' },
  { id: '22', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'create', entityType: 'user',         entityId: '3', entityName: 'Pedro Oliveira',    details: 'Usuário criado com perfil: atendente',           ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-02-01T09:15:00Z' },
  { id: '23', userId: '1', userName: 'João Silva',        userEmail: 'joao.silva@email.com',     action: 'login',  entityType: 'user',         entityId: '1', entityName: 'João Silva',        details: 'Login realizado com sucesso',                    ipAddress: '192.168.1.13', userAgent: 'Chrome/124', createdAt: '2026-04-23T07:50:00Z' },
  { id: '24', userId: '6', userName: 'Admin User',        userEmail: 'admin@email.com',          action: 'update', entityType: 'lead',         entityId: '1', entityName: 'Empresa Alpha',     details: 'Atendente responsável alterado',                 ipAddress: '192.168.1.10', userAgent: 'Chrome/124', createdAt: '2026-01-10T14:00:00Z' },
  { id: '25', userId: '2', userName: 'Maria Santos',      userEmail: 'maria.santos@email.com',   action: 'create', entityType: 'negotiation',  entityId: 'n3', entityName: 'Lead: Flux Partners', details: 'Negociação criada (tipo: comentário)',          ipAddress: '192.168.1.15', userAgent: 'Chrome/124', createdAt: '2026-04-15T12:00:00Z' },
];

// ==================== HANDLERS ====================
export const handlers = [
  // ========== AUTH ==========
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    if (password !== '123456') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { ...userWithoutPassword } = user;
    return HttpResponse.json({ user: userWithoutPassword, token: 'fake-jwt-token-' + user.role });
  }),

  // ========== DASHBOARD METRICS ==========
  http.get('/api/dashboard/metrics', ({ request }) => {
    const url = new URL(request.url);
    const store     = url.searchParams.get('store');
    const team      = url.searchParams.get('team');
    const startDate = url.searchParams.get('startDate');
    const endDate   = url.searchParams.get('endDate');

    // Filtrar leads por loja e equipe
    let filtered = [...mockLeads];
    if (store && store !== 'all') {
      filtered = filtered.filter(l => l.store === store);
    }
    if (team && team !== 'all') {
      filtered = filtered.filter(l => l.teamId === team);
    }

    // Computar métricas dinamicamente com filtro de data
    const metrics = computeMetrics(filtered, startDate, endDate);
    return HttpResponse.json(metrics);
  }),

  // ========== LEADS ==========
  http.get('/api/leads', ({ request }) => {
    const url = new URL(request.url);
    const page       = parseInt(url.searchParams.get('page') || '1');
    const limit      = parseInt(url.searchParams.get('limit') || '10');
    const search     = url.searchParams.get('search')?.toLowerCase() || '';
    const status     = url.searchParams.get('status');
    const importance = url.searchParams.get('importance');
    const startDate  = url.searchParams.get('startDate');
    const endDate    = url.searchParams.get('endDate');
    const store      = url.searchParams.get('store');
    const team       = url.searchParams.get('team');

    let filtered = [...mockLeads];
    if (startDate) {
      const startDay = startDate.split('T')[0];
      filtered = filtered.filter(l => l.createdAt.split('T')[0] >= startDay);
    }
    if (endDate) {
      const endDay = endDate.split('T')[0];
      filtered = filtered.filter(l => l.createdAt.split('T')[0] <= endDay);
    }
    if (store && store !== 'all') filtered = filtered.filter(l => l.store === store);
    if (team  && team  !== 'all') filtered = filtered.filter(l => l.teamId === team);
    if (search)     filtered = filtered.filter(l => l.name.toLowerCase().includes(search) || l.email.toLowerCase().includes(search));
    if (status)     filtered = filtered.filter(l => l.status === status);
    if (importance) filtered = filtered.filter(l => l.importance === importance);

    const start     = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/leads/:id', ({ params }) => {
    const lead = mockLeads.find(l => l.id === params.id);
    if (!lead) return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    return HttpResponse.json(lead);
  }),

  // ========== NEGOCIAÇÕES ==========
  http.get('/api/leads/:id/negotiations', ({ params }) => {
    return HttpResponse.json(mockNegotiations.filter(n => n.leadId === params.id));
  }),

  http.post('/api/leads/:id/negotiations', async ({ params, request }) => {
    const body = await request.json() as { content: string; type: string; importance?: string; stage?: string };
    const existingActive = mockNegotiations.find(n => n.leadId === params.id && n.status === 'ativa');
    if (existingActive) {
      return HttpResponse.json(
        { message: 'Lead já possui uma negociação ativa. Encerre a atual antes de criar uma nova.' },
        { status: 400 }
      );
    }
    const newNegotiation = {
      id: Date.now().toString(),
      leadId: params.id as string,
      userId: '1',
      content: body.content,
      type: body.type,
      importance: body.importance ?? 'frio',
      stage: body.stage ?? 'primeiro_contato',
      status: 'ativa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: undefined,
      closedReason: undefined,
    };
    mockNegotiations.push(newNegotiation);
    return HttpResponse.json(newNegotiation, { status: 201 });
  }),

  http.put('/api/negotiations/:id/close', async ({ params, request }) => {
    const body = await request.json() as { reason: string };
    const idx = mockNegotiations.findIndex(n => n.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Negociação não encontrada' }, { status: 404 });
    mockNegotiations[idx] = {
      ...mockNegotiations[idx],
      status: 'encerrada',
      updatedAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      closedReason: body.reason,
    };
    return HttpResponse.json(mockNegotiations[idx]);
  }),

  // ========== USERS CRUD ==========
  http.get('/api/users', ({ request }) => {
    const url    = new URL(request.url);
    const page   = parseInt(url.searchParams.get('page') || '1');
    const limit  = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const role   = url.searchParams.get('role');
    const teamId = url.searchParams.get('teamId');

    let filtered = [...mockUsers];
    if (search) filtered = filtered.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    if (role)   filtered = filtered.filter(u => u.role === role);
    if (teamId) filtered = filtered.filter(u => u.teamId === teamId);

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);
    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as any;
    const newUser = { id: (mockUsers.length + 1).toString(), ...body, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const idx  = mockUsers.findIndex(u => u.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    mockUsers[idx] = { ...mockUsers[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(mockUsers[idx]);
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const idx = mockUsers.findIndex(u => u.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    if (params.id === '6') return HttpResponse.json({ message: 'Cannot delete admin user' }, { status: 400 });
    mockUsers.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),

  // ========== LEADS CRUD ==========
  http.post('/api/leads', async ({ request }) => {
    const body = await request.json() as any;
    const newLead = {
      id: (mockLeads.length + 1).toString(),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      status: body.status || 'novo',
      importance: body.importance || 'media',
      origin: body.origin || 'Site',
      store: body.store || 'loja1',
      teamId: body.teamId || null,
      assignedTo: body.assignedTo || null,
      lossReason: body.lossReason || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.push(newLead);
    return HttpResponse.json(newLead, { status: 201 });
  }),

  http.put('/api/leads/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const idx = mockLeads.findIndex(l => l.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    mockLeads[idx] = { ...mockLeads[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(mockLeads[idx]);
  }),

  http.delete('/api/leads/:id', ({ params }) => {
    const idx = mockLeads.findIndex(l => l.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    mockLeads.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),

  // ========== CLIENTS ==========
  http.get('/api/clients', ({ request }) => {
    const url        = new URL(request.url);
    const page       = parseInt(url.searchParams.get('page')  || '1');
    const limit      = parseInt(url.searchParams.get('limit') || '10');
    const search     = url.searchParams.get('search')?.toLowerCase() || '';
    const assignedTo = url.searchParams.get('assignedTo');

    let filtered = [...mockClients];
    if (search)     filtered = filtered.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search) || (c.cpf || '').includes(search));
    if (assignedTo) filtered = filtered.filter(c => c.assignedTo === assignedTo);

    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total: filtered.length, page, limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/clients/:id', ({ params }) => {
    const client = mockClients.find(c => c.id === params.id);
    if (!client) return HttpResponse.json({ message: 'Client not found' }, { status: 404 });
    return HttpResponse.json(client);
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = await request.json() as any;
    const lead = mockLeads.find(l => l.id === body.leadId);
    const newClient = {
      id: (mockClients.length + 1).toString(),
      name: body.name,
      email: body.email || '',
      phone: body.phone || '',
      cpf: body.cpf || '',
      leadId: body.leadId || null,
      leadName: lead?.name || '',
      assignedTo: body.assignedTo || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return HttpResponse.json(newClient, { status: 201 });
  }),

  http.put('/api/clients/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const idx  = mockClients.findIndex(c => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Client not found' }, { status: 404 });
    const lead = body.leadId ? mockLeads.find(l => l.id === body.leadId) : null;
    mockClients[idx] = { ...mockClients[idx], ...body, leadName: lead?.name ?? mockClients[idx].leadName, updatedAt: new Date().toISOString() };
    return HttpResponse.json(mockClients[idx]);
  }),

  http.delete('/api/clients/:id', ({ params }) => {
    const idx = mockClients.findIndex(c => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Client not found' }, { status: 404 });
    mockClients.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),

  // ========== TEAMS ==========
  http.get('/api/teams', () => {
    const enriched = mockTeams.map(team => {
      const manager = mockUsers.find(u => u.id === team.managerId);
      return { ...team, managerName: manager?.name ?? null, memberCount: team.members.length };
    });
    return HttpResponse.json(enriched);
  }),

  http.post('/api/teams', async ({ request }) => {
    const body = await request.json() as any;
    const newTeam = {
      id: (mockTeams.length + 1).toString(),
      name: body.name,
      description: body.description || '',
      managerId: body.managerId || null,
      members: body.members || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTeams.push(newTeam);
    const manager = mockUsers.find(u => u.id === newTeam.managerId);
    return HttpResponse.json({ ...newTeam, managerName: manager?.name ?? null, memberCount: newTeam.members.length }, { status: 201 });
  }),

  http.put('/api/teams/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const idx = mockTeams.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Team not found' }, { status: 404 });
    mockTeams[idx] = { ...mockTeams[idx], ...body, updatedAt: new Date().toISOString() };
    const manager = mockUsers.find(u => u.id === mockTeams[idx].managerId);
    return HttpResponse.json({ ...mockTeams[idx], managerName: manager?.name ?? null, memberCount: mockTeams[idx].members.length });
  }),

  http.delete('/api/teams/:id', ({ params }) => {
    const idx = mockTeams.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Team not found' }, { status: 404 });
    mockTeams.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),

  // ========== LOGS ==========
  http.get('/api/logs', ({ request }) => {
    const url        = new URL(request.url);
    const page       = parseInt(url.searchParams.get('page')  || '1');
    const limit      = parseInt(url.searchParams.get('limit') || '20');
    const search     = url.searchParams.get('search')?.toLowerCase() || '';
    const action     = url.searchParams.get('action');
    const entityType = url.searchParams.get('entityType');
    const startDate  = url.searchParams.get('startDate');
    const endDate    = url.searchParams.get('endDate');

    let filtered = [...mockLogs];
    if (search)     filtered = filtered.filter(l => l.userName.toLowerCase().includes(search) || l.entityName?.toLowerCase().includes(search) || l.details.toLowerCase().includes(search));
    if (action)     filtered = filtered.filter(l => l.action === action);
    if (entityType) filtered = filtered.filter(l => l.entityType === entityType);
    if (startDate)  filtered = filtered.filter(l => l.createdAt.split('T')[0] >= startDate.split('T')[0]);
    if (endDate)    filtered = filtered.filter(l => l.createdAt.split('T')[0] <= endDate.split('T')[0]);

    // Ordenar do mais recente para o mais antigo
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start     = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return HttpResponse.json({ data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) });
  }),
];

export const worker = setupWorker(...handlers);
