import { NegotiationImportance, NegotiationStage } from "../types";

export interface ICreateNegotiationRequest {
  leadId: string;
  importancia: NegotiationImportance;
  estagio: NegotiationStage;
}

export interface IUpdateNegotiationRequest {
  statusId?: string;
  estagioId?: string;
  importancia?: NegotiationImportance;
}

export interface INegotiationService {
  createNegotiation(data: ICreateNegotiationRequest): Promise<void>;
  updateNegotiation(id: string, data: IUpdateNegotiationRequest): Promise<void>;
}