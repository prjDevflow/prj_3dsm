import { LeadsRepository } from '../repositories/LeadsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IUpdateLeadRequest {
  leadId: string;
  lojaId?: string;
  origemId?: string;
  atendenteId?: string; // Para reatribuição de lead
  usuarioLogadoId: string;
  usuarioLogadoRole: string;
  usuarioLogadoEquipeId?: string | null;
}

export class UpdateLeadService {
  private leadsRepository: LeadsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.leadsRepository = new LeadsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute(data: IUpdateLeadRequest) {
    const lead = await this.leadsRepository.findByIdWithDetails(data.leadId);

    if (!lead) {
      const error = new Error("Lead não encontrado.");
      (error as any).statusCode = 404;
      throw error;
    }

    // 🚨 REGRA DE OURO (RF02) - Validação Granular de Pertencimento no Backend 🚨
    if (data.usuarioLogadoRole === 'ATENDENTE') {
      if (lead.usuario.id_usuario !== data.usuarioLogadoId) {
        const error = new Error("Acesso negado: Só pode editar leads sob a sua responsabilidade.");
        (error as any).statusCode = 403;
        throw error;
      }
    } else if (data.usuarioLogadoRole === 'GERENTE') {
      if (lead.usuario.id_equipe !== data.usuarioLogadoEquipeId) {
        const error = new Error("Acesso negado: Só pode editar leads de atendentes da sua equipa.");
        (error as any).statusCode = 403;
        throw error;
      }
    } else if (data.usuarioLogadoRole === 'GERENTE_GERAL') {
      const error = new Error("Acesso negado: O Gerente Geral não tem permissão para editar leads.");
      (error as any).statusCode = 403;
      throw error;
    }
    // Se for ADMIN, passa direto (tem acesso total)

    const leadAtualizado = await this.leadsRepository.update(data.leadId, {
      id_loja: data.lojaId,
      id_origem: data.origemId,
      id_usuario: data.atendenteId // Apenas se houver reatribuição
    });

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'LEAD',
      entidadeId: leadAtualizado.id_lead,
      usuarioResponsavelId: data.usuarioLogadoId
    });

    return leadAtualizado;
  }
}