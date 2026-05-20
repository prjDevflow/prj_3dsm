export interface ILead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'perdido' | 'ganho';
  importance: 'baixa' | 'media' | 'alta';
  origin: string;
  store?: string;
  teamId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lossReason?: string;
}

export interface ICreateLeadRequest {
  name: string;
  email: string;
  phone?: string;
  store: string;
  origin: string;
  assignedTo?: string;
}

export interface IUpdateLeadRequest {
  id: string;
  store?: string;
  origin?: string;
  assignedTo?: string;
}

export type FetchLeadsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  importance?: string;
  dateRange?: { start: Date; end: Date };
  store?: string;
  team?: string;
};

export interface ILeadsService {
  getLeads(params: FetchLeadsParams): Promise<{
    data: ILead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getLeadById(id: string): Promise<ILead>;
  createLead(data: ICreateLeadRequest): Promise<ILead>;
  updateLead(id: string, data: Partial<IUpdateLeadRequest>): Promise<ILead>;
  deleteLead(id: string): Promise<void>;
}
