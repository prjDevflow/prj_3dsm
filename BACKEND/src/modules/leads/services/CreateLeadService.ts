import { LeadsRepository } from '../repositories/LeadsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';
import { LeadStatus } from '../../../domain/models/Lead'; // <-- CORREÇÃO: Importamos o Enum de Status

interface ICreateLeadRequest {
  clienteId: string;
  atendenteId: string; // Quem está logado e responsável pelo lead
  lojaId: string;
  origem: string;
  status?: string;
}

export class CreateLeadService {
  private leadsRepository: LeadsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.leadsRepository = new LeadsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute(data: ICreateLeadRequest) {
    // 1. Cria o Lead no PostgreSQL (o repositório valida os IDs da Loja, Cliente e Origem)
    const lead = await this.leadsRepository.create({
      clienteId: data.clienteId,
      atendenteId: data.atendenteId,
      lojaId: data.lojaId,
      origem: data.origem,
      status: LeadStatus.NOVO
    });

    // 2. Regista a ação na tabela de auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'LEAD',
      entidadeId: lead.id,
      usuarioResponsavelId: data.atendenteId
    });

    return lead;
  }
}