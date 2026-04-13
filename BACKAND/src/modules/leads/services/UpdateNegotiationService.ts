import { INegotiationsRepository } from "../repositories/INegotiationsRepository";
import { Negotiation, NegotiationStatus } from "../../../domain/models/Negotiation";

interface IRequest {
  negotiationId: string;
  userId: string;
  role: string;
  status: NegotiationStatus;
  estagio: string;
}

export class UpdateNegotiationService {
  constructor(
    private negotiationsRepository: INegotiationsRepository
  ) {}

  async execute({ negotiationId, userId, role, status, estagio }: IRequest): Promise<Negotiation> {
    const negotiation = await this.negotiationsRepository.findById(negotiationId);

    if (!negotiation) {
      throw new Error("Negociação não encontrada.");
    }

    // RF02: Controle de Acesso - Atendente só mexe no que é seu [cite: 66, 193]
    if (role === 'ATENDENTE' && negotiation.atendenteId !== userId) {
      throw new Error("Acesso negado: Você só pode atualizar suas próprias negociações.");
    }

    // RF03: Antes de atualizar, salva o histórico da mudança [cite: 131]
    await this.negotiationsRepository.createHistory({
      negotiationId,
      statusAnterior: negotiation.status,
      statusNovo: status,
      estagioAnterior: negotiation.estagio,
      estagioNovo: estagio,
      usuarioId: userId,
      criadoEm: new Date()
    });

    // Atualiza os dados
    negotiation.status = status;
    negotiation.estagio = estagio;
    negotiation.atualizadoEm = new Date();

    // Se o status mudar para GANHO ou PERDIDO, a negociação deixa de estar ativa [cite: 128, 132]
    if (status !== NegotiationStatus.ABERTA) {
      negotiation.isAberta = false;
    } else {
      negotiation.isAberta = true;
    }

    return this.negotiationsRepository.save(negotiation);
  }
}