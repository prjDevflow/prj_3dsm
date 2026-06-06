import { AppError } from '../../../shared/errors/AppError';
import { prisma } from '../../../shared/infra/prisma/client';
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
      throw new AppError("Lead não encontrado.", 404);
    }

    // 🚨 REGRA DE OURO (RF02) - Validação Granular de Pertencimento no Backend 🚨
    if (data.usuarioLogadoRole === 'ATENDENTE') {
      if (lead.usuario.id_usuario !== data.usuarioLogadoId) {
        throw new AppError("Acesso negado: Só pode editar leads sob a sua responsabilidade.", 403);
      }
    } else if (data.usuarioLogadoRole === 'GERENTE') {
      if (lead.usuario.id_equipe !== data.usuarioLogadoEquipeId) {
        throw new AppError("Acesso negado: Só pode editar leads de atendentes da sua equipa.", 403);
      }
    } else if (data.usuarioLogadoRole === 'GERENTE_GERAL') {
      throw new AppError("Acesso negado: O Gerente Geral não tem permissão para editar leads.", 403);
    }
    // Se for ADMIN, passa direto (tem acesso total)

    const leadAtualizado = await this.leadsRepository.update(data.leadId, {
      id_loja: data.lojaId,
      id_origem: data.origemId,
      id_usuario: data.atendenteId // Apenas se houver reatribuição
    });

    // Auditoria (RF07)
    const clienteInfo = await prisma.lead.findUnique({
      where: { id_lead: data.leadId },
      include: { cliente: { select: { nome_cliente: true } }, loja: { select: { nome_loja: true } } },
    });

    const alteracoes: string[] = [];
    if (data.lojaId) alteracoes.push(`loja: ${clienteInfo?.loja?.nome_loja ?? '—'}`);
    if (data.atendenteId) alteracoes.push('responsável reatribuído');
    if (data.origemId) alteracoes.push('origem');

    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'LEAD',
      entidadeId: leadAtualizado.id_lead,
      usuarioResponsavelId: data.usuarioLogadoId,
      detalhes: `Lead de '${clienteInfo?.cliente?.nome_cliente ?? '—'}' atualizado — ${alteracoes.join(', ') || 'dados gerais'}`,
    });

    return leadAtualizado;
  }
}