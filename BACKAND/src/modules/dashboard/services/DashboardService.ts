import { LeadsRepository } from "../../leads/repositories/LeadsRepository";
import { DateValidator } from "../../../shared/utils/DateValidator";
import { Lead, LeadStatus } from "../../../domain/models/Lead";
import { UserRole } from "../../../domain/models/UserRole";

interface IDashboardRequest {
  userId: string;
  role: string;
  startDate: Date;
  endDate: Date;
}

export class DashboardService {
  private leadsRepository: LeadsRepository;

  constructor() {
    this.leadsRepository = new LeadsRepository();
  }

  async execute({ userId, role, startDate, endDate }: IDashboardRequest) {
    // 1. Bloqueio de Segurança (RF02) - Atendente não tem acesso ao dashboard
    if (role === UserRole.ATENDENTE) {
      throw new Error("Acesso negado: Atendentes não possuem acesso ao dashboard analítico.");
    }

    // 2. Validação de Segurança de Datas (RF06 - Limite de 1 ano no backend)
    DateValidator.validateFilterRange(startDate.toISOString(), endDate.toISOString(), role);

    // 3. Busca os leads baseados na hierarquia (RF02)
    let leads: Lead[] = [];

    if (role === UserRole.ADMIN || role === UserRole.GERENTE_GERAL) {
      // Visão Global
      leads = await this.leadsRepository.findAll();
    } else if (role === UserRole.GERENTE) {
      // Visão Consolidada da Equipe (RF02)
      leads = await this.leadsRepository.findByEquipeDoGerente(userId);
    }

    // 4. Filtra pelo período exato (start e end)
    const filteredLeads: Lead[] = leads.filter((lead: Lead) => 
      lead.criadoEm >= startDate && lead.criadoEm <= endDate
    );

    // 5. Cálculo de Métricas (RF04 e RF05)
    const totalLeads = filteredLeads.length;
    const convertidos = filteredLeads.filter((l: Lead) => l.status === LeadStatus.FINALIZADO).length;
    
    // Performance por Loja (Agrupamento)
    const performanceLoja = filteredLeads.reduce((acc: any, lead: Lead) => {
      acc[lead.lojaId] = (acc[lead.lojaId] || 0) + 1;
      return acc;
    }, {});

    return {
      periodoAplicado: {
        inicio: startDate,
        fim: endDate,
        escopo: role === UserRole.GERENTE ? "Equipe" : "Global"
      },
      indicadores: {
        totalLeads,
        leadsConvertidos: convertidos,
        taxaConversao: totalLeads > 0 ? ((convertidos / totalLeads) * 100).toFixed(2) + '%' : '0%',
        performanceLoja
      }
    };
  }
}