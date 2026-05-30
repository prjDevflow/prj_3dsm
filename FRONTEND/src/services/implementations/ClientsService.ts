import InstanceApi from "../instanceApi";
import { IClientsService, IClient, ICreateClientRequest, IUpdateClientRequest, FetchClientsParams } from "../IClientsService";

export class ClientsService implements IClientsService {
  async getClients(params: FetchClientsParams): Promise<{
    data: IClient[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await InstanceApi.get("/clientes", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        assignedTo: params.assignedTo,
        ...(params.hasLead !== undefined && { hasLead: params.hasLead }),
      },
    });
    return response.data;
  }

  async getClientById(id: string): Promise<IClient> {
    const response = await InstanceApi.get(`/clientes/${id}`);
    return response.data;
  }

  async createClient(data: ICreateClientRequest): Promise<IClient> {
    const response = await InstanceApi.post("/clientes", data);
    return response.data;
  }

  async updateClient(id: string, data: Partial<IUpdateClientRequest>): Promise<IClient> {
    const response = await InstanceApi.put(`/clientes/${id}`, data);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await InstanceApi.delete(`/clientes/${id}`);
  }
}
