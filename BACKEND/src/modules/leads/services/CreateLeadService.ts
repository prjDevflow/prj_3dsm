import { LeadsRepository } from '../repositories/LeadsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface ICreateLeadRequest {
  clienteId: string;
  lojaId: string;
  origemId: string;
  usuarioLogadoId: string;
}

export class CreateLeadService {
  private leadsRepository: LeadsRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.leadsRepository = new LeadsRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ clienteId, lojaId, origemId, usuarioLogadoId }: ICreateLeadRequest) {
    // 1. Criação do Lead mapeando as propriedades para os nomes exatos do banco de dados (Prisma)
    const lead = await this.leadsRepository.create({
      id_cliente: clienteId,
      id_loja: lojaId,
      id_origem: origemId,
      id_usuario: usuarioLogadoId // O atendente logado é o responsável
    });

    // 2. Regista a operação na tabela de auditoria (RF07)
    // Utilizamos lead.id_lead pois é o nome exato da PK no schema.prisma
    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'LEAD',
      entidadeId: lead.id_lead,
      usuarioResponsavelId: usuarioLogadoId
    });

    return lead;
  }
}