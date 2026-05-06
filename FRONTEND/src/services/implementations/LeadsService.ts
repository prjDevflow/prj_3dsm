import InstanceApi from "../instanceApi";
import { ILeadsService, FetchLeadsParams, ILead, ICreateLeadRequest, IUpdateLeadRequest } from "../ILeadsService";

export class LeadsService implements ILeadsService {
  async getLeads(params: FetchLeadsParams): Promise<{
    data: ILead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await InstanceApi.get("/leads", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        importance: params.importance,
        startDate: params.dateRange?.start.toISOString().split("T")[0],
        endDate: params.dateRange?.end.toISOString().split("T")[0],
        store: params.store,
        team: params.team,
      },
    });
    return response.data;
  }

  async getLeadById(id: string): Promise<ILead> {
    const response = await InstanceApi.get(`/leads/${id}`);
    return response.data;
  }

  async createLead(data: ICreateLeadRequest): Promise<ILead> {
    const response = await InstanceApi.post("/leads", data);
    return response.data;
  }

  async updateLead(id: string, data: Partial<IUpdateLeadRequest>): Promise<ILead> {
    const response = await InstanceApi.put(`/leads/${id}`, data);
    return response.data;
  }

  async deleteLead(id: string): Promise<void> {
    await InstanceApi.delete(`/leads/${id}`);
  }
}
