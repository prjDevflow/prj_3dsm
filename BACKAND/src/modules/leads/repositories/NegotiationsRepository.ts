import { Negotiation, NegotiationHistory } from "../../../domain/models/Negotiation";
import { INegotiationsRepository } from "./INegotiationsRepository";

export class NegotiationsRepository implements INegotiationsRepository {
  // Arrays em memória (para desenvolvimento antes do Prisma)
  private negotiations: Negotiation[] = [];
  private history: NegotiationHistory[] = [];

  async findById(id: string): Promise<Negotiation | null> {
    const negotiation = this.negotiations.find(n => n.id === id);
    return negotiation ?? null; 
  }

  async findActiveByLeadId(leadId: string): Promise<Negotiation | null> {
    const negotiation = this.negotiations.find(n => n.leadId === leadId && n.isAberta === true);
    return negotiation ?? null;
  }

  async create(data: Partial<Negotiation>): Promise<Negotiation> {
    const negotiation = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      isAberta: true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    } as Negotiation;

    this.negotiations.push(negotiation);
    return negotiation;
  }

  async save(negotiation: Negotiation): Promise<Negotiation> {
    const index = this.negotiations.findIndex(n => n.id === negotiation.id);
    if (index !== -1) {
      negotiation.atualizadoEm = new Date();
      this.negotiations[index] = negotiation;
    } else {
      this.negotiations.push(negotiation);
    }
    return negotiation;
  }

  // --- Métodos de Histórico (RF03) ---

  async createHistory(data: Partial<NegotiationHistory>): Promise<void> {
    const newHistory = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      criadoEm: new Date()
    } as NegotiationHistory;

    this.history.push(newHistory);
  }

  async findHistoryByNegotiationId(negotiationId: string): Promise<NegotiationHistory[]> {
    return this.history.filter(h => h.negotiationId === negotiationId);
  }
}