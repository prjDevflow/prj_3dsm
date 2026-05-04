export interface IClient {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  leadId?: string;
  leadName?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateClientRequest {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  leadId?: string;
  assignedTo?: string;
}

export interface IUpdateClientRequest {
  id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  leadId?: string;
}

export type FetchClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  assignedTo?: string;
};

export interface IClientsService {
  getClients(params: FetchClientsParams): Promise<{
    data: IClient[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getClientById(id: string): Promise<IClient>;
  createClient(data: ICreateClientRequest): Promise<IClient>;
  updateClient(id: string, data: Partial<IUpdateClientRequest>): Promise<IClient>;
  deleteClient(id: string): Promise<void>;
}
