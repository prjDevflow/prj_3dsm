export interface IClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  leadId?: string;
  consultorId?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateClientRequest {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  leadId?: string;
  consultorId?: string;
}

export interface IUpdateClientRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  leadId?: string;
  consultorId?: string;
}

export type FetchClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  assignedTo?: string;
  hasLead?: boolean;
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
