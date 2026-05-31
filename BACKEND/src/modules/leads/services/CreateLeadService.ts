import { PrismaClient } from '@prisma/client';
import { LeadsRepository } from '../repositories/LeadsRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

const prisma = new PrismaClient();

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
    const [cliente, atendente, loja] = await Promise.all([
      prisma.cliente.findUnique({ where: { id_cliente: clienteId }, select: { nome_cliente: true } }),
      prisma.usuario.findUnique({ where: { id_usuario: usuarioLogadoId }, select: { nome_usuario: true } }),
      prisma.loja.findUnique({ where: { id_loja: lojaId }, select: { nome_loja: true } }),
    ]);

    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'LEAD',
      entidadeId: lead.id_lead,
      usuarioResponsavelId: usuarioLogadoId,
      detalhes: `Lead de '${cliente?.nome_cliente ?? 'cliente'}' criado — loja: ${loja?.nome_loja ?? '—'}, atendente: ${atendente?.nome_usuario ?? '—'}`,
    });

    return lead;
  }
}