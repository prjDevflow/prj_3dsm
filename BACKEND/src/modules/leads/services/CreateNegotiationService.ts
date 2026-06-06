import { prisma } from '../../../shared/infra/prisma/client';
import { NegotiationsRepository } from '../repositories/NegotiationsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';
import { NegotiationStatus } from '../../../domain/models/Negotiation';
import { AppError } from '../../../shared/errors/AppError';


interface ICreateNegotiationRequest {
  leadId: string;
  importancia: 'FRIO' | 'MORNO' | 'QUENTE';
  estagio: string;
  usuarioLogadoId: string;
  observacao?: string;
}

export class CreateNegotiationService {
  private negotiationsRepository: NegotiationsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.negotiationsRepository = new NegotiationsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute(data: ICreateNegotiationRequest) {
    // 🚨 VALIDAÇÃO DO RF03: Verifica ativamente se o Lead já tem uma negociação aberta!
    const negociacaoAtiva = await this.negotiationsRepository.findActiveByLeadId(data.leadId);

    if (negociacaoAtiva) {
      throw new AppError("Regra de Negócio Violada (RF03): Este Lead já possui uma negociação ativa aberta.", 400);
    }

    // 1. Cria a negociação (agora segura!)
    const negotiation = await this.negotiationsRepository.create({
      leadId: data.leadId,
      importancia: data.importancia,
      estagio: data.estagio,
      status: NegotiationStatus.ABERTA,
      isAberta: true,
      observacao: data.observacao,
    });

    // 2. Grava o histórico inicial da Negociação (RF03)
    await this.negotiationsRepository.createHistory({
      negotiationId: negotiation.id,
      statusAnterior: '-',
      statusNovo: negotiation.status,
      estagioAnterior: '-',
      estagioNovo: negotiation.estagio,
      usuarioId: data.usuarioLogadoId
    });

    // 3. Regista a operação na tabela de auditoria (RF07)
    const leadInfo = await prisma.lead.findUnique({
      where: { id_lead: data.leadId },
      include: { cliente: { select: { nome_cliente: true } } },
    });

    const importanciaLabel: Record<string, string> = { QUENTE: 'quente', MORNO: 'morno', FRIO: 'frio' };

    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'NEGOCIACAO',
      entidadeId: negotiation.id,
      usuarioResponsavelId: data.usuarioLogadoId,
      detalhes: `Nova negociação para lead de '${leadInfo?.cliente?.nome_cliente ?? '—'}' — estágio: ${negotiation.estagio}, importância: ${importanciaLabel[data.importancia] ?? data.importancia}`,
    });

    return negotiation;
  }
}