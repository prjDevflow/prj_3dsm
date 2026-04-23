import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  async create(data: { leadId: string; importancia: string; estagio: string; status: string; isAberta: boolean }) {
    const neg = await prisma.negociacao.create({
      data: {
        id_lead: data.leadId,
        importancia_negociacao: data.importancia,
        id_estagio: data.estagio,
        id_status: data.status,
        estado_abertura_negociacao: data.isAberta
      }
    });

    return {
      id: neg.id_negociacao,
      status: neg.id_status,
      estagio: neg.id_estagio
    };
  }

  // ✅ CORREÇÃO APLICADA AQUI: Método update que estava em falta
  async update(id_negociacao: string, data: { id_status: string; id_estagio: string; importancia_negociacao: string }) {
    const neg = await prisma.negociacao.update({
      where: { id_negociacao },
      data
    });
    
    return {
      id: neg.id_negociacao,
      status: neg.id_status,
      estagio: neg.id_estagio
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