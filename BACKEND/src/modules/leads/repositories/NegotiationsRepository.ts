import { PrismaClient } from '@prisma/client';
import { Negotiation, NegotiationStatus } from '../../../domain/models/Negotiation';

const prisma = new PrismaClient();

export class NegotiationsRepository {
  
  async findById(id: string): Promise<Negotiation | null> {
    const neg = await prisma.negociacao.findUnique({
      where: { id_negociacao: id },
      include: {
        status: true,
        estagio: true,
        lead: true
      }
    });

    if (!neg) return null;

    return {
      id: neg.id_negociacao,
      leadId: neg.id_lead,
      atendenteId: neg.lead.id_usuario,
      importancia: neg.importancia_negociacao as 'FRIO' | 'MORNO' | 'QUENTE',
      status: neg.status.nome_status as NegotiationStatus,
      estagio: neg.estagio.nome_estagio,
      isAberta: neg.estado_abertura_negociacao,
      motivoFinalizacao: neg.motivo_finalizacao_negociacao,
      criadoEm: neg.data_criacao_negociacao,
      atualizadoEm: new Date() // Fallback temporário caso não rastreie a atualização no banco
    };
  }

  async save(data: Negotiation): Promise<Negotiation> {
    
    // Como status e estagio são tabelas separadas, buscamos primeiro os IDs correspondentes
    // a partir dos nomes string enviados.
    const statusRecord = await prisma.status.findUnique({
      where: { nome_status: data.status }
    });

    const estagioRecord = await prisma.estagio.findUnique({
      where: { nome_estagio: data.estagio }
    });

    if (!statusRecord || !estagioRecord) {
      throw new Error("Status ou Estágio fornecido não existe no banco de dados.");
    }

    // Mapeamento e atualização no PostgreSQL
    const updated = await prisma.negociacao.update({
      where: { id_negociacao: data.id },
      data: {
        estado_abertura_negociacao: data.isAberta,
        importancia_negociacao: data.importancia,
        motivo_finalizacao_negociacao: data.motivoFinalizacao, // <-- MAPEMENTO DO RF05
        id_status: statusRecord.id_status,
        id_estagio: estagioRecord.id_estagio
      }
    });

    return {
      ...data,
      isAberta: updated.estado_abertura_negociacao,
      motivoFinalizacao: updated.motivo_finalizacao_negociacao
    };
  }

  async createHistory(data: {
    negotiationId: string;
    statusAnterior: string;
    statusNovo: string;
    estagioAnterior: string;
    estagioNovo: string;
    usuarioId: string;
  }): Promise<void> {
    
    const detalhe = `Mudança de Status [${data.statusAnterior} -> ${data.statusNovo}] | Estágio [${data.estagioAnterior} -> ${data.estagioNovo}]`;

    await prisma.historicoNegociacao.create({
      data: {
        id_negociacao: data.negotiationId,
        id_usuario: data.usuarioId,
        detalhe_alteracao_historico: detalhe
      }
    });
  }
}