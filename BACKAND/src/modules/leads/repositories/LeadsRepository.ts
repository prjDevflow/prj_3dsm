import { Lead } from "../../../domain/models/Lead";

export class LeadsRepository {
  // Array em memória para desenvolvimento antes de integrar o Prisma/PostgreSQL
  private leads: Lead[] = [];

  async findAll(): Promise<Lead[]> {
    return this.leads;
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = this.leads.find(l => l.id === id);
    return lead ?? null;
  }

  async findByAtendente(atendenteId: string): Promise<Lead[]> {
    return this.leads.filter(l => l.atendenteId === atendenteId);
  }

  /**
   * RF02 - O Gerente visualiza leads de todos os atendentes de sua equipe
   * Esta função filtra os leads pelo ID do gerente responsável.
   */
  async findByEquipeDoGerente(gerenteId: string): Promise<Lead[]> {
    // Quando mudarmos para o Prisma ORM, faremos um JOIN (include) com a tabela de equipes.
    // Por enquanto, filtramos baseando-nos numa propriedade fictícia do modelo em memória.
    return this.leads.filter(lead => lead.gerenteResponsavelId === gerenteId);
  }

  async create(data: Partial<Lead>): Promise<Lead> {
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    } as Lead;

    this.leads.push(newLead);
    return newLead;
  }

  async save(lead: Lead): Promise<Lead> {
    const index = this.leads.findIndex(l => l.id === lead.id);
    if (index !== -1) {
      lead.atualizadoEm = new Date();
      this.leads[index] = lead;
    } else {
      this.leads.push(lead);
    }
    return lead;
  }
}