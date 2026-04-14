import { PrismaClient } from '@prisma/client';
import { Lead, LeadStatus } from "../../../domain/models/Lead";

const prisma = new PrismaClient();

export class LeadsRepository {
  
  async findAll(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      include: this.getIncludes()
    });
    return leads.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({
      where: { id_lead: id },
      include: this.getIncludes()
    });
    return lead ? this.mapToDomain(lead) : null;
  }

  async findByAtendente(atendenteId: string): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      where: { id_usuario: atendenteId },
      include: this.getIncludes()
    });
    return leads.map(this.mapToDomain);
  }

  async findByEquipeDoGerente(gerenteId: string): Promise<Lead[]> {
    const gerente = await prisma.usuario.findUnique({
      where: { id_usuario: gerenteId },
      select: { id_equipe: true }
    });

    if (!gerente || !gerente.id_equipe) {
      return []; 
    }

    const leads = await prisma.lead.findMany({
      where: {
        usuario: { id_equipe: gerente.id_equipe }
      },
      include: this.getIncludes()
    });

    return leads.map(this.mapToDomain);
  }

  async create(data: Partial<Lead>): Promise<Lead> {
    const status = await prisma.status.findUnique({ where: { nome_status: data.status || 'NOVO' } });
    
    // VERIFICAÇÃO INTELIGENTE: É um UUID ou um Nome?
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(data.origem || '');
    
    const origem = isUuid 
      ? await prisma.origem.findUnique({ where: { id_origem: data.origem } })
      : await prisma.origem.findUnique({ where: { nome_origem: data.origem } });

    if (!status || !origem) {
      throw new Error(`Erro de integridade: Status ou Origem não encontrados na base de dados. Origem recebida: ${data.origem}`);
    }

    const leadCriado = await prisma.lead.create({
      data: {
        id_cliente: data.clienteId!,
        id_usuario: data.atendenteId!,
        id_loja: data.lojaId!,
        id_origem: origem.id_origem,
        id_status: status.id_status,
      },
      include: this.getIncludes()
    });

    return this.mapToDomain(leadCriado);
  }

  async save(lead: Lead): Promise<Lead> {
    const status = await prisma.status.findUnique({ where: { nome_status: lead.status } });
    
    const leadAtualizado = await prisma.lead.update({
      where: { id_lead: lead.id },
      data: {
        id_usuario: lead.atendenteId,
        id_status: status?.id_status,
      },
      include: this.getIncludes()
    });

    return this.mapToDomain(leadAtualizado);
  }

  private getIncludes() {
    return {
      origem: true,
      status: true,
      usuario: true
    };
  }

  private mapToDomain(dbLead: any): Lead {
    return {
      id: dbLead.id_lead,
      clienteId: dbLead.id_cliente,
      atendenteId: dbLead.id_usuario,
      lojaId: dbLead.id_loja,
      origem: dbLead.origem.nome_origem, 
      status: dbLead.status.nome_status as LeadStatus, 
      criadoEm: dbLead.data_criacao_lead,
      atualizadoEm: dbLead.data_atualizacao_lead,
      gerenteResponsavelId: dbLead.usuario?.id_equipe 
    } as Lead;
  }
}