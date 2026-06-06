import { prisma } from '../../../shared/infra/prisma/client';

const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class NegotiationsRepository {
  
  async findActiveByLeadId(leadId: string) {
    return prisma.negociacao.findFirst({
      where: {
        id_lead: leadId,
        estado_abertura_negociacao: true
      }
    });
  }

  async findById(id_negociacao: string) {
    const neg = await prisma.negociacao.findUnique({
      where: { id_negociacao }
    });
    
    if (!neg) return null;
    
    // Mapeamos a saída do Prisma para o formato que a sua entidade de domínio espera
    return {
      id: neg.id_negociacao,
      leadId: neg.id_lead,
      importancia: neg.importancia_negociacao,
      status: neg.id_status,
      estagio: neg.id_estagio,
      isAberta: neg.estado_abertura_negociacao
    };
  }

  async create(data: { leadId: string; importancia: string; estagio: string; status: string; isAberta: boolean; observacao?: string }) {
    // Resolve UUID do status pelo nome (ex: 'ABERTA' → UUID)
    const statusRecord = await prisma.status.findFirst({
      where: { nome_status: { equals: data.status, mode: 'insensitive' } },
    });
    if (!statusRecord) {
      throw new Error(`Status '${data.status}' não encontrado na base de dados. Execute o seed.`);
    }

    // Resolve UUID do estágio pelo nome ou pelo próprio UUID (fallback)
    const estagioWhere = isUuid.test(data.estagio)
      ? { OR: [{ nome_estagio: { equals: data.estagio, mode: 'insensitive' as const } }, { id_estagio: data.estagio }] }
      : { nome_estagio: { equals: data.estagio, mode: 'insensitive' as const } };

    const estagioRecord = await prisma.estagio.findFirst({ where: estagioWhere });
    if (!estagioRecord) {
      throw new Error(`Estágio '${data.estagio}' não encontrado na base de dados. Execute o seed.`);
    }

    const neg = await prisma.negociacao.create({
      data: {
        id_lead:                    data.leadId,
        importancia_negociacao:     data.importancia.toLowerCase(),
        id_estagio:                 estagioRecord.id_estagio,
        id_status:                  statusRecord.id_status,
        estado_abertura_negociacao: data.isAberta,
        ...(data.observacao ? { observacao_negociacao: data.observacao } : {}),
      },
    });

    return {
      id:     neg.id_negociacao,
      status: statusRecord.nome_status,
      estagio: estagioRecord.nome_estagio,
    };
  }

  async update(id_negociacao: string, data: { id_status: string; id_estagio: string; importancia_negociacao: string }) {
    // Tenta resolver IDs por nome caso não sejam UUIDs

    let statusId = data.id_status;
    if (!isUuid.test(data.id_status)) {
      const s = await prisma.status.findFirst({
        where: { nome_status: { equals: data.id_status, mode: 'insensitive' } },
      });
      if (s) statusId = s.id_status;
    }

    let estagioId = data.id_estagio;
    if (!isUuid.test(data.id_estagio)) {
      const e = await prisma.estagio.findFirst({
        where: { nome_estagio: { equals: data.id_estagio, mode: 'insensitive' } },
      });
      if (e) estagioId = e.id_estagio;
    }

    const neg = await prisma.negociacao.update({
      where: { id_negociacao },
      data: {
        id_status:  statusId,
        id_estagio: estagioId,
        ...(data.importancia_negociacao
          ? { importancia_negociacao: data.importancia_negociacao.toLowerCase() }
          : {}),
      },
    });

    return {
      id:     neg.id_negociacao,
      status: neg.id_status,
      estagio: neg.id_estagio,
    };
  }

  async createHistory(data: { negotiationId: string; statusAnterior: string; statusNovo: string; estagioAnterior: string; estagioNovo: string; usuarioId: string }) {
    return prisma.historicoNegociacao.create({
      data: {
        id_negociacao: data.negotiationId,
        id_usuario: data.usuarioId,
        detalhe_alteracao_historico: `Mudança de Status (${data.statusAnterior} -> ${data.statusNovo}) e Estágio (${data.estagioAnterior} -> ${data.estagioNovo}).`
      }
    });
  }
}