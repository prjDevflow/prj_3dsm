import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LeadsRepository {
  
  // Método de criação mantido intacto (chamado pelo CreateLeadService)
  async create(data: { clienteId: string; atendenteId: string; lojaId: string; origem: string }) {
    return prisma.lead.create({
      data: {
        id_cliente: data.clienteId,
        id_usuario: data.atendenteId,
        id_loja: data.lojaId,
        id_origem: data.origem
      }
    });
  }

  // Busca TUDO com filtro de data (Para ADMIN e GERENTE_GERAL)
  async findAll(startDate: Date, endDate: Date) {
    return prisma.lead.findMany({
      where: {
        data_criacao_lead: { gte: startDate, lte: endDate }
      },
      include: {
        cliente: true,
        usuario: true,
        origem: true,
        loja: true,
        negociacoes: {
          include: { status: true, estagio: true }
        }
      },
      orderBy: { data_criacao_lead: 'desc' }
    });
  }

  // Busca leads da EQUIPE do gerente com filtro de data (Para GERENTE)
  async findByEquipeDoGerente(gerenteId: string, startDate: Date, endDate: Date) {
    // Primeiro, descobre qual é a equipa do gerente
    const gerente = await prisma.usuario.findUnique({
      where: { id_usuario: gerenteId },
      select: { id_equipe: true }
    });

    return prisma.lead.findMany({
      where: {
        data_criacao_lead: { gte: startDate, lte: endDate },
        usuario: { id_equipe: gerente?.id_equipe }
      },
      include: {
        cliente: true,
        usuario: true,
        origem: true,
        loja: true,
        negociacoes: {
          include: { status: true, estagio: true }
        }
      },
      orderBy: { data_criacao_lead: 'desc' }
    });
  }

  // Busca APENAS os leads do próprio atendente com filtro de data (Para ATENDENTE)
  async findByAtendente(atendenteId: string, startDate: Date, endDate: Date) {
    return prisma.lead.findMany({
      where: {
        data_criacao_lead: { gte: startDate, lte: endDate },
        id_usuario: atendenteId
      },
      include: {
        cliente: true,
        usuario: true,
        origem: true,
        loja: true,
        negociacoes: {
          include: { status: true, estagio: true }
        }
      },
      orderBy: { data_criacao_lead: 'desc' }
    });
  }
}