import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// ==================== MOCK DE LEADS (EXISTENTE) ====================
const mockLeads = [
  {
    id: '1',
    name: 'Empresa Alpha',
    email: 'contato@alpha.com',
    phone: '(11) 99999-1111',
    status: 'novo',
    importance: 'alta',
    origin: 'Site',
    assignedTo: '1',
    createdAt: '2025-03-10T10:00:00Z',
    updatedAt: '2025-03-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Beta Corp',
    email: 'vendas@beta.com',
    phone: '(21) 98888-2222',
    status: 'contatado',
    importance: 'media',
    origin: 'Indicação',
    assignedTo: '1',
    createdAt: '2025-03-12T14:30:00Z',
    updatedAt: '2025-03-13T09:15:00Z',
  },
  {
    id: '3',
    name: 'Gama Ltda',
    email: 'financeiro@gama.com',
    phone: '(31) 97777-3333',
    status: 'qualificado',
    importance: 'alta',
    origin: 'Google Ads',
    assignedTo: '3',
    createdAt: '2025-03-05T08:20:00Z',
    updatedAt: '2025-03-14T11:40:00Z',
  },
  {
    id: '4',
    name: 'Delta SA',
    email: 'comercial@delta.com',
    phone: '(41) 96666-4444',
    status: 'perdido',
    importance: 'baixa',
    origin: 'Facebook',
    assignedTo: '2',
    createdAt: '2025-02-28T16:45:00Z',
    updatedAt: '2025-03-09T12:00:00Z',
  },
  {
    id: '5',
    name: 'Omega Tech',
    email: 'propostas@omega.com',
    phone: '(51) 95555-5555',
    status: 'ganho',
    importance: 'alta',
    origin: 'Evento',
    assignedTo: '1',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-15T17:30:00Z',
  },
  {
    id: '6',
    name: 'Sigma Solutions',
    email: 'contato@sigma.com',
    phone: '(61) 94444-6666',
    status: 'novo',
    importance: 'media',
    origin: 'LinkedIn',
    assignedTo: '2',
    createdAt: '2025-03-16T11:20:00Z',
    updatedAt: '2025-03-16T11:20:00Z',
  },
  {
    id: '7',
    name: 'Theta Industria',
    email: 'vendas@theta.com',
    phone: '(71) 93333-7777',
    status: 'contatado',
    importance: 'alta',
    origin: 'Google Ads',
    assignedTo: '1',
    createdAt: '2025-03-14T13:45:00Z',
    updatedAt: '2025-03-15T10:30:00Z',
  },
  {
    id: '8',
    name: 'Labs Digital',
    email: 'contato@labs.com',
    phone: '(81) 92222-8888',
    status: 'qualificado',
    importance: 'baixa',
    origin: 'Site',
    assignedTo: '3',
    createdAt: '2025-03-13T09:15:00Z',
    updatedAt: '2025-03-14T16:20:00Z',
  },
  {
    id: '9',
    name: 'Tech Solutions',
    email: 'comercial@tech.com',
    phone: '(91) 91111-9999',
    status: 'novo',
    importance: 'alta',
    origin: 'Indicação',
    assignedTo: '2',
    createdAt: '2025-03-15T14:30:00Z',
    updatedAt: '2025-03-15T14:30:00Z',
  },
  {
    id: '10',
    name: 'Inova Sistemas',
    email: 'propostas@inova.com',
    phone: '(31) 90000-1111',
    status: 'perdido',
    importance: 'media',
    origin: 'Facebook',
    assignedTo: '1',
    createdAt: '2025-03-08T10:00:00Z',
    updatedAt: '2025-03-12T17:45:00Z',
  },
  {
    id: '11',
    name: 'Nexus Corp',
    email: 'contato@nexus.com',
    phone: '(11) 98888-3333',
    status: 'novo',
    importance: 'baixa',
    origin: 'Site',
    assignedTo: '3',
    createdAt: '2025-03-16T16:00:00Z',
    updatedAt: '2025-03-16T16:00:00Z',
  },
  {
    id: '12',
    name: 'Prime Solutions',
    email: 'vendas@prime.com',
    phone: '(21) 97777-4444',
    status: 'contatado',
    importance: 'alta',
    origin: 'Google Ads',
    assignedTo: '1',
    createdAt: '2025-03-15T11:30:00Z',
    updatedAt: '2025-03-16T09:15:00Z',
  },
];

// ==================== MOCK DE NEGOCIAÇÕES (EXISTENTE) ====================
let mockNegotiations = [
  { 
    id: '1', 
    leadId: '1', 
    userId: '1', 
    content: 'Primeiro contato feito por email. Cliente demonstrou interesse em saber mais sobre nossos serviços.', 
    type: 'comentário',
    status: 'encerrada',
    createdAt: '2025-03-10T11:00:00Z',
    updatedAt: '2025-03-10T11:00:00Z',
    closedAt: '2025-03-11T09:00:00Z',
    closedReason: 'Lead qualificado'
  },
  { 
    id: '2', 
    leadId: '1', 
    userId: '1', 
    content: 'Enviada proposta comercial com desconto de 10% para fechamento trimestral.', 
    type: 'proposta',
    status: 'encerrada',
    createdAt: '2025-03-11T09:30:00Z',
    updatedAt: '2025-03-11T09:30:00Z',
    closedAt: '2025-03-12T14:00:00Z',
    closedReason: 'Aguardando resposta'
  },
  { 
    id: '3', 
    leadId: '1', 
    userId: '2', 
    content: 'Cliente pediu alterações na proposta. Ajustes enviados.', 
    type: 'comentário',
    status: 'ativa',
    createdAt: '2025-03-12T14:15:00Z',
    updatedAt: '2025-03-12T14:15:00Z'
  },
  { 
    id: '4', 
    leadId: '3', 
    userId: '3', 
    content: 'Demonstração agendada para próxima terça-feira às 14h.', 
    type: 'contato',
    status: 'encerrada',
    createdAt: '2025-03-06T14:00:00Z',
    updatedAt: '2025-03-06T14:00:00Z',
    closedAt: '2025-03-07T10:00:00Z'
  },
  { 
    id: '5', 
    leadId: '3', 
    userId: '3', 
    content: 'Demonstração realizada. Cliente muito interessado no módulo de relatórios.', 
    type: 'comentário',
    status: 'encerrada',
    createdAt: '2025-03-07T15:30:00Z',
    updatedAt: '2025-03-07T15:30:00Z'
  },
  { 
    id: '6', 
    leadId: '3', 
    userId: '1', 
    content: 'Enviada proposta personalizada com foco em relatórios automatizados.', 
    type: 'proposta',
    status: 'ativa',
    createdAt: '2025-03-08T10:45:00Z',
    updatedAt: '2025-03-08T10:45:00Z'
  },
  { 
    id: '7', 
    leadId: '5', 
    userId: '1', 
    content: 'Lead qualificado. Passar para negociação comercial.', 
    type: 'comentário',
    status: 'encerrada',
    createdAt: '2025-03-02T09:00:00Z',
    updatedAt: '2025-03-02T09:00:00Z'
  },
  { 
    id: '8', 
    leadId: '5', 
    userId: '1', 
    content: 'Contrato assinado! Cliente optou pelo plano anual.', 
    type: 'comentário',
    status: 'encerrada',
    createdAt: '2025-03-15T17:30:00Z',
    updatedAt: '2025-03-15T17:30:00Z'
  },
];

// ==================== MOCK DE MÉTRICAS (EXISTENTE) ====================
const mockMetrics = {
  kpis: {
    totalLeads: 156,
    convertedLeads: 42,
    conversionRate: 26.9,
    avgDealValue: 12500,
    totalRevenue: 525000,
  },
  funnel: [
    { stage: 'Novo', count: 45 },
    { stage: 'Contatado', count: 60 },
    { stage: 'Qualificado', count: 30 },
    { stage: 'Ganho', count: 21 },
  ],
  bySource: [
    { source: 'Site', count: 70 },
    { source: 'Google Ads', count: 40 },
    { source: 'Facebook', count: 25 },
    { source: 'Indicação', count: 15 },
    { source: 'Evento', count: 6 },
  ],
  byStatus: [
    { status: 'novo', count: 45 },
    { status: 'contatado', count: 60 },
    { status: 'qualificado', count: 30 },
    { status: 'perdido', count: 20 },
    { status: 'ganho', count: 21 },
  ],
  byImportance: [
    { importance: 'baixa', count: 50 },
    { importance: 'media', count: 70 },
    { importance: 'alta', count: 36 },
  ],
  evolution: [
    { date: '01/03', leads: 5, conversions: 1 },
    { date: '02/03', leads: 7, conversions: 2 },
    { date: '03/03', leads: 4, conversions: 0 },
    { date: '04/03', leads: 8, conversions: 3 },
    { date: '05/03', leads: 6, conversions: 2 },
    { date: '06/03', leads: 9, conversions: 1 },
    { date: '07/03', leads: 5, conversions: 2 },
  ],
  performance: [
    { agent: 'João', leads: 30, conversions: 8 },
    { agent: 'Maria', leads: 25, conversions: 7 },
    { agent: 'Pedro', leads: 18, conversions: 4 },
    { agent: 'Ana', leads: 22, conversions: 6 },
  ],
  lossReasons: [
    { reason: 'Preço', count: 8 },
    { reason: 'Concorrência', count: 5 },
    { reason: 'Prazo', count: 3 },
    { reason: 'Suporte', count: 2 },
    { reason: 'Outros', count: 2 },
  ],
};

// ==================== NOVOS MOCKS DE USUÁRIOS E EQUIPES ====================
// Mock de usuários
let mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    role: 'atendente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    role: 'atendente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    role: 'atendente',
    teamId: '2',
    active: true,
    createdAt: '2025-02-01T09:15:00Z',
    updatedAt: '2025-02-01T09:15:00Z',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    role: 'gerente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  },
  {
    id: '5',
    name: 'Carlos Souza',
    email: 'carlos.souza@email.com',
    role: 'gerente',
    teamId: '2',
    active: true,
    createdAt: '2025-01-12T16:45:00Z',
    updatedAt: '2025-01-12T16:45:00Z',
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@email.com',
    role: 'admin',
    teamId: null,
    active: true,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: '7',
    name: 'Atendente Teste',
    email: 'atendente@email.com',
    role: 'atendente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '8',
    name: 'Gerente Teste',
    email: 'gerente@email.com',
    role: 'gerente',
    teamId: '2',
    active: true,
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  },
  {
    id: '9',
    name: 'Gerente Geral Teste',
    email: 'gerente_geral@email.com',
    role: 'gerente_geral',
    teamId: undefined,
    active: true,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
];

// Mock de equipes
const mockTeams = [
  {
    id: '1',
    name: 'Vendas Centro',
    description: 'Equipe responsável pela loja do centro',
    managerId: '4',
    members: ['1', '2', '7'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Vendas Norte',
    description: 'Equipe responsável pela loja norte',
    managerId: '5',
    members: ['3', '8'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// ==================== HANDLERS ====================
export const handlers = [
  // ========== AUTH ==========
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Mock: qualquer senha 123456 funciona
    if (password !== '123456') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    // Buscar usuário pelo email
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const { ...userWithoutPassword } = user;
    return HttpResponse.json({
      user: userWithoutPassword,
      token: 'fake-jwt-token-' + user.role,
    });
  }),

  // ========== DASHBOARD METRICS ==========
  http.get('/api/dashboard/metrics', ({ request }) => {
    const url = new URL(request.url);
    const store = url.searchParams.get('store');
    const team = url.searchParams.get('team');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    console.log('Filtros aplicados no dashboard:', { store, team, startDate, endDate });
    
    let filteredMetrics = { ...mockMetrics };
    
    // Exemplo de filtro por loja (apenas demonstração)
    if (store === 'loja1') {
      filteredMetrics = {
        ...filteredMetrics,
        kpis: {
          ...filteredMetrics.kpis,
          totalLeads: Math.floor(filteredMetrics.kpis.totalLeads * 0.3),
        }
      };
    } else if (store === 'loja2') {
      filteredMetrics = {
        ...filteredMetrics,
        kpis: {
          ...filteredMetrics.kpis,
          totalLeads: Math.floor(filteredMetrics.kpis.totalLeads * 0.4),
        }
      };
    } else if (store === 'loja3') {
      filteredMetrics = {
        ...filteredMetrics,
        kpis: {
          ...filteredMetrics.kpis,
          totalLeads: Math.floor(filteredMetrics.kpis.totalLeads * 0.3),
        }
      };
    }
    
    return HttpResponse.json(filteredMetrics);
  }),

  // ========== LEADS ==========
  http.get('/api/leads', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status');
    const importance = url.searchParams.get('importance');

    let filtered = [...mockLeads];

    if (search) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(search) || 
        lead.email.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(lead => lead.status === status);
    }

    if (importance) {
      filtered = filtered.filter(lead => lead.importance === importance);
    }

    const start = (page - 1) * limit;
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
    if (!lead) {
      return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    }
    return HttpResponse.json(lead);
  }),

  // ========== NEGOTIATIONS ==========
  http.get('/api/leads/:id/negotiations', ({ params }) => {
    const negotiations = mockNegotiations.filter(n => n.leadId === params.id);
    return HttpResponse.json(negotiations);
  }),

  http.post('/api/leads/:id/negotiations', async ({ params, request }) => {
    const body = await request.json() as { content: string; type: string };
    
    console.log('POST /api/leads/:id/negotiations', { params, body });

    // Verificar se já existe negociação ativa
    const existingActive = mockNegotiations.find(
      n => n.leadId === params.id && n.status === 'ativa'
    );

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
      status: 'ativa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockNegotiations.push(newNegotiation);
    
    return HttpResponse.json(newNegotiation, { status: 201 });
  }),

  http.put('/api/negotiations/:id/close', async ({ params, request }) => {
    const body = await request.json() as { reason: string };
    
    const negotiationIndex = mockNegotiations.findIndex(n => n.id === params.id);
    
    if (negotiationIndex === -1) {
      return HttpResponse.json({ message: 'Negociação não encontrada' }, { status: 404 });
    }

    mockNegotiations[negotiationIndex] = {
      ...mockNegotiations[negotiationIndex],
      status: 'encerrada',
      updatedAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      closedReason: body.reason,
    };

    return HttpResponse.json(mockNegotiations[negotiationIndex]);
  }),

  // ========== USERS CRUD (NOVO) ==========
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const role = url.searchParams.get('role');
    const teamId = url.searchParams.get('teamId');

    let filtered = [...mockUsers];

    if (search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search)
      );
    }

    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }

    if (teamId) {
      filtered = filtered.filter(user => user.teamId === teamId);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as any;
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...body,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const index = mockUsers.findIndex(u => u.id === params.id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(mockUsers[index]);
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = mockUsers.findIndex(u => u.id === params.id);
    
    if (index === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Não permitir deletar o próprio usuário
    if (params.id === '6') { // ID do admin
      return HttpResponse.json({ message: 'Cannot delete admin user' }, { status: 400 });
    }

    mockUsers.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // ========== TEAMS (NOVO) ==========
  http.get('/api/teams', () => {
    return HttpResponse.json(mockTeams);
  }),
];

export const worker = setupWorker(...handlers);