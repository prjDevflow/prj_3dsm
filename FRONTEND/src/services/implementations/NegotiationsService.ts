import InstanceApi from "../instanceApi";
import { ICreateNegotiationRequest, INegotiationService, IUpdateNegotiationRequest } from "../INegotiationsService";

export class NegotiationService implements INegotiationService {
  async createNegotiation(data: ICreateNegotiationRequest): Promise<void> {
    await InstanceApi.post("/leads/negotiations", data);
  }

  async updateNegotiation(id: string, data: IUpdateNegotiationRequest): Promise<void> {
    await InstanceApi.put(`/leads/negotiations/${id}`, data);
  }

  async closeNegotiation(id: string, reason: string): Promise<void> {
    await InstanceApi.put(`/leads/negotiations/${id}/close`, { reason });
  }
}
