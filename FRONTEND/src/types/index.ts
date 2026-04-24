export type UserRole = 'atendente' | 'gerente' | 'gerente_geral' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  members: string[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMetrics {
  teamId: string;
  teamName: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  topPerformers: {
    userId: string;
    name: string;
    leads: number;
    conversions: number;
  }[];
}

export interface Log {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete';
  entityType: 'user' | 'team' | 'lead' | 'negotiation' | 'client';
  entityId?: string;
  entityName?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'perdido' | 'ganho';
  importance: 'baixa' | 'media' | 'alta';
  origin: string;
  store?: string;
  assignedTo?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Negotiation {
  id: string;
  leadId: string;
  userId: string;
  content: string;
  type: 'comentário' | 'proposta' | 'contato';
  status: 'ativa' | 'encerrada';
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
  closedReason?: string;
}

export interface DashboardMetrics {
  kpis: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    avgDealValue: number;
    totalRevenue: number;
  };
  funnel: {
    stage: string;
    count: number;
  }[];
  bySource: {
    source: string;
    count: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  byImportance: {
    importance: string;
    count: number;
  }[];
  byStore: {
    store: string;
    count: number;
  }[];
  convertedVsNonConverted: {
    name: string;
    value: number;
  }[];
  byTeam: {
    team: string;
    count: number;
  }[];
  avgTimeToFirstContact: string;
  evolution: {
    date: string;
    leads: number;
    conversions: number;
  }[];
  performance: {
    agent: string;
    leads: number;
    conversions: number;
  }[];
  lossReasons: {
    reason: string;
    count: number;
  }[];
}