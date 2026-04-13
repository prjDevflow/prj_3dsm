import { Negotiation } from "../../../domain/models/Negotiation";
import { INegotiationsRepository } from "../repositories/INegotiationsRepository";

export class CreateNegotiationService {
  constructor(
    private negotiationsRepository: INegotiationsRepository
  ) {}

  async execute({ leadId, importancia }: any): Promise<Negotiation> {
    const activeNegotiation = await this.negotiationsRepository.findActiveByLeadId(leadId);

    if (activeNegotiation) {
      throw new Error("Este lead já possui uma negociação ativa.");
    }

    return this.negotiationsRepository.create({
      leadId,
      importancia,
      isAberta: true,
      criadoEm: new Date()
    });
  }
}