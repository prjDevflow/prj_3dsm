import { NegotiationsRepository } from '../repositories/NegotiationsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';
import { NegotiationStatus } from '../../../domain/models/Negotiation';

interface IUpdateNegotiationRequest {
  negotiationId: string;
  usuarioLogadoId: string;
  novoStatus: NegotiationStatus;
  novoEstagio: string;
  novaImportancia: 'FRIO' | 'MORNO' | 'QUENTE';
  motivoFinalizacao?: string; // ADICIONADO: Essencial para o RF05
}

export class UpdateNegotiationService {
  private negotiationsRepository: NegotiationsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.negotiationsRepository = new NegotiationsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute(data: IUpdateNegotiationRequest) {
    // 1. Busca a negociação atual para saber o estado anterior
    const currentNeg = await this.negotiationsRepository.findById(data.negotiationId);

    if (!currentNeg) {
      throw new Error("Negociação não encontrada.");
    }

    // 2. Regra de Negócio: Se o novo status for GANHO ou PERDIDO, a negociação é fechada.
    const isAberta = !(data.novoStatus === NegotiationStatus.GANHO || data.novoStatus === NegotiationStatus.PERDIDO);

    // 3. Validação do Motivo (Garante consistência de dados)
    const motivoFinalizacaoValidado = !isAberta ? data.motivoFinalizacao : null;

    // 4. Atualiza na Base de Dados via Repositório
    const updatedNegotiation = await this.negotiationsRepository.save({
      ...currentNeg,
      status: data.novoStatus,
      estagio: data.novoEstagio,
      importancia: data.novaImportancia,
      isAberta,
      motivoFinalizacao: motivoFinalizacaoValidado
    });

    // 5. RF03: Regista o histórico da mudança (Rastreabilidade)
    await this.negotiationsRepository.createHistory({
      negotiationId: data.negotiationId,
      statusAnterior: currentNeg.status,
      statusNovo: data.novoStatus,
      estagioAnterior: currentNeg.estagio,
      estagioNovo: data.novoEstagio,
      usuarioId: data.usuarioLogadoId
    });

    // 6. RF07: Regista o Log de Auditoria
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'NEGOCIACAO',
      entidadeId: data.negotiationId,
      usuarioResponsavelId: data.usuarioLogadoId
    });

    return updatedNegotiation;
  }
}