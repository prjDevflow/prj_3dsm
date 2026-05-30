import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LeadsRepository {
  // ---------------------------------------------------------
  // MÉTODOS DE CRIAÇÃO E LISTAGEM
  // ---------------------------------------------------------

  async create(data: { id_cliente: string; id_usuario: string; id_loja: string; id_origem: string }) {
    return prisma.lead.create({
      data
    });
  }

  private readonly includeRelations = {
    cliente: true,
    usuario: true,
    loja:    true,
    origem:  true,
    negociacoes: {
      include: { status: true, estagio: true },
      orderBy: { data_criacao_negociacao: 'desc' as const },
    },
  };

  // Lista todos (Administrador e Gerente Geral)
  async findAll(startDate?: Date, endDate?: Date, lojaName?: string, equipeName?: string) {
    return prisma.lead.findMany({
      where: {
        data_criacao_lead: { gte: startDate, lte: endDate },
        ...(lojaName   ? { loja:    { nome_loja:               lojaName   } } : {}),
        ...(equipeName ? { usuario: { equipe: { nome_equipe: equipeName } } } : {}),
      },
      include: this.includeRelations,
      orderBy: { data_criacao_lead: 'desc' },
    });
  }

  // Lista apenas os leads dos Atendentes da equipa do Gerente
  async findByEquipeDoGerente(gerenteId: string, startDate?: Date, endDate?: Date, lojaName?: string) {
    const gerente = await prisma.usuario.findUnique({ where: { id_usuario: gerenteId } });

    return prisma.lead.findMany({
      where: {
        usuario: { id_equipe: gerente?.id_equipe },
        data_criacao_lead: { gte: startDate, lte: endDate },
        ...(lojaName ? { loja: { nome_loja: lojaName } } : {}),
      },
      include: this.includeRelations,
      orderBy: { data_criacao_lead: 'desc' },
    });
  }

  // Lista apenas os leads do próprio Atendente
  async findByAtendente(atendenteId: string, startDate?: Date, endDate?: Date, lojaName?: string) {
    return prisma.lead.findMany({
      where: {
        id_usuario: atendenteId,
        data_criacao_lead: { gte: startDate, lte: endDate },
        ...(lojaName ? { loja: { nome_loja: lojaName } } : {}),
      },
      include: this.includeRelations,
      orderBy: { data_criacao_lead: 'desc' },
    });
  }

  // ---------------------------------------------------------
  // MÉTODOS DE VALIDAÇÃO E ATUALIZAÇÃO (RF02)
  // ---------------------------------------------------------

  // Traz o Lead com a equipa do dono para validarmos o pertencimento antes de editar
  async findByIdWithDetails(id_lead: string) {
    return prisma.lead.findUnique({
      where: { id_lead },
      include: {
        usuario: {
          select: { id_usuario: true, id_equipe: true }
        }
      }
    });
  }

  async update(id_lead: string, data: { id_loja?: string; id_origem?: string; id_usuario?: string }) {
    return prisma.lead.update({
      where: { id_lead },
      data
    });
  }
}