import { Negotiation, NegotiationHistory } from "../../../domain/models/Negotiation";

export interface INegotiationsRepository {
  findById(id: string): Promise<Negotiation | null>;
  findActiveByLeadId(leadId: string): Promise<Negotiation | null>;
  create(data: any): Promise<Negotiation>;
  save(negotiation: Negotiation): Promise<Negotiation>;
  
  // Métodos para Histórico
  createHistory(data: any): Promise<void>;
  findHistoryByNegotiationId(negotiationId: string): Promise<NegotiationHistory[]>;
}