import { NegotiationsRepository } from '../repositories/NegotiationsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IUpdateNegotiationRequest {
  negotiationId: string;
  statusId: string;
  estagioId: string;
  importancia: string;
  usuarioLogadoId: string;
}

export class UpdateNegotiationService {
  private negotiationsRepository: NegotiationsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.negotiationsRepository = new NegotiationsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute(data: IUpdateNegotiationRequest) {
    const negociacaoAntiga = await this.negotiationsRepository.findById(data.negotiationId);
    
    if (!negociacaoAntiga) {
        const error = new Error("Negociação não encontrada.");
        (error as any).statusCode = 404;
        throw error;
    }

    // 1. Atualiza a Negociação
    const negociacaoAtualizada = await this.negotiationsRepository.update(data.negotiationId, {
      id_status: data.statusId,
      id_estagio: data.estagioId,
      importancia_negociacao: data.importancia,
    });

    // 2. Regra de Negócio (RF03): Manter Histórico das mudanças
    // CORREÇÃO APLICADA AQUI: Utilizamos .status e .estagio conforme o seu domínio
    await this.negotiationsRepository.createHistory({
      negotiationId: data.negotiationId,
      statusAnterior: negociacaoAntiga.status, 
      statusNovo: data.statusId,
      estagioAnterior: negociacaoAntiga.estagio, 
      estagioNovo: data.estagioId,
      usuarioId: data.usuarioLogadoId
    });

    // 3. Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'NEGOCIACAO',
      entidadeId: data.negotiationId,
      usuarioResponsavelId: data.usuarioLogadoId
    });

    return negociacaoAtualizada;
  }
}