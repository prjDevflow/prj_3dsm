export type UserRole = 'atendente' | 'gerente' | 'gerente_geral' | 'admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  // teamId?: string;
  // active: boolean;
  // createdAt: string;
  // updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
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