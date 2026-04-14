import { PrismaClient } from '@prisma/client';
import { Negotiation, NegotiationStatus, NegotiationHistory } from "../../../domain/models/Negotiation";
import { INegotiationsRepository } from "./INegotiationsRepository";

const prisma = new PrismaClient();

export class NegotiationsRepository implements INegotiationsRepository {

  async findById(id: string): Promise<Negotiation | null> {
    const negociacao = await prisma.negociacao.findUnique({
      where: { id_negociacao: id },
      include: this.getIncludes()
    });
    return negociacao ? this.mapToDomain(negociacao) : null;
  }

  async findActiveByLeadId(leadId: string): Promise<Negotiation | null> {
    const negociacao = await prisma.negociacao.findFirst({
      where: { 
        id_lead: leadId,
        estado_abertura_negociacao: true 
      },
      include: this.getIncludes()
    });
    return negociacao ? this.mapToDomain(negociacao) : null;
  }

  async create(data: Partial<Negotiation>): Promise<Negotiation> {
    // 1. Busca Inteligente do Status (Aceita Nome ou Pega o Primeiro que existir)
    let status = await prisma.status.findUnique({ where: { nome_status: data.status || 'ABERTA' } });
    if (!status) {
      status = await prisma.status.findFirst(); // Fallback à prova de balas
    }

    // 2. Busca Inteligente do Estágio
    let estagio = await prisma.estagio.findUnique({ where: { nome_estagio: data.estagio } });
    if (!estagio) {
      estagio = await prisma.estagio.findFirst(); // Fallback à prova de balas
    }

    if (!status || !estagio) {
      throw new Error(`Erro Crítico: Base de dados vazia. Nenhuma Origem ou Estágio encontrados.`);
    }

    try {
      const novaNegociacao = await prisma.negociacao.create({
        data: {
          id_lead: data.leadId!,
          estado_abertura_negociacao: data.isAberta ?? true,
          importancia_negociacao: data.importancia!,
          id_estagio: estagio.id_estagio,
          id_status: status.id_status,
        },
        include: this.getIncludes()
      });

      return this.mapToDomain(novaNegociacao);
      
    } catch (error: any) {
      // 🚨 MÁGICA DO RF03: Intercepta a tentativa de criar duas negociações abertas para o mesmo Lead
      if (error.code === 'P2002') {
        // Se bater aqui, o nosso segundo teste vai passar e dar o Status 400 que queríamos!
        const rf03Error = new Error("Regra de Negócio Violada (RF03): Este Lead já possui uma negociação ativa aberta.");
        (rf03Error as any).statusCode = 400; // Força o Express a devolver 400 em vez de 500
        throw rf03Error;
      }
      throw error;
    }
  }

  async save(negotiation: Negotiation): Promise<Negotiation> {
    const status = await prisma.status.findUnique({ where: { nome_status: negotiation.status } });
    const estagio = await prisma.estagio.findUnique({ where: { nome_estagio: negotiation.estagio } });

    const negociacaoAtualizada = await prisma.negociacao.update({
      where: { id_negociacao: negotiation.id },
      data: {
        estado_abertura_negociacao: negotiation.isAberta,
        importancia_negociacao: negotiation.importancia,
        id_estagio: estagio?.id_estagio,
        id_status: status?.id_status,
      },
      include: this.getIncludes()
    });

    return this.mapToDomain(negociacaoAtualizada);
  }

  // --- Métodos de Histórico (RF03) ---

  async createHistory(data: Partial<NegotiationHistory>): Promise<void> {
    const detalhe = `Status alterou de [${data.statusAnterior}] para [${data.statusNovo}] | Estágio alterou de [${data.estagioAnterior}] para [${data.estagioNovo}]`;

    await prisma.historicoNegociacao.create({
      data: {
        id_negociacao: data.negotiationId!,
        id_usuario: data.usuarioId!,
        detalhe_alteracao_historico: detalhe
      }
    });
  }

  async findHistoryByNegotiationId(negotiationId: string): Promise<NegotiationHistory[]> {
    const historicos = await prisma.historicoNegociacao.findMany({
      where: { id_negociacao: negotiationId },
      orderBy: { data_alteracao_historico: 'desc' }
    });

    return historicos.map(h => ({
      id: h.id_historico,
      negotiationId: h.id_negociacao,
      usuarioId: h.id_usuario,
      criadoEm: h.data_alteracao_historico,
      statusAnterior: '-',
      statusNovo: '-',
      estagioAnterior: '-',
      estagioNovo: h.detalhe_alteracao_historico 
    })) as unknown as NegotiationHistory[];
  }

  private getIncludes() {
    return { status: true, estagio: true, lead: true };
  }

  private mapToDomain(dbNegociacao: any): Negotiation {
    return {
      id: dbNegociacao.id_negociacao,
      leadId: dbNegociacao.id_lead,
      atendenteId: dbNegociacao.lead?.id_usuario,
      importancia: dbNegociacao.importancia_negociacao,
      status: dbNegociacao.status.nome_status as NegotiationStatus,
      estagio: dbNegociacao.estagio.nome_estagio,
      isAberta: dbNegociacao.estado_abertura_negociacao,
      criadoEm: dbNegociacao.data_criacao_negociacao,
      atualizadoEm: dbNegociacao.data_criacao_negociacao
    };
  }
}