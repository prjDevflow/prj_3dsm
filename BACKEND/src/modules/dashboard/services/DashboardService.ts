import { PrismaClient } from '@prisma/client';
import { DateValidator } from '../../../shared/utils/DateValidator';

const prisma = new PrismaClient();

interface IDashboardRequest {
  role: string;
  userId: string;
  equipeId?: string | null;
  inicio?: string;
  fim?: string;
}

export class DashboardService {
  async execute({ role, userId, equipeId, inicio, fim }: IDashboardRequest) {
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    const normalizedRole = role.toUpperCase();

    const baseWhere: any = {
      data_criacao_lead: { gte: startDate, lte: endDate }
    };

    if (normalizedRole === 'ATENDENTE') {
      baseWhere.id_usuario = userId;
    } else if (normalizedRole === 'GERENTE') {
      if (!equipeId) throw new Error("Gerente sem equipa vinculada.");
      baseWhere.usuario = { id_equipe: equipeId };
    }

    // Leads com relações necessárias
    const leads = await prisma.lead.findMany({
      where: baseWhere,
      include: {
        origem: true,
        loja: true,
        usuario: { include: { equipe: true } },
        negociacoes: {
          include: { status: true, estagio: true }
        }
      }
    });

    const totalLeads = leads.length;

    // KPIs
    let convertedLeads = 0;
    leads.forEach(lead => {
      const ganhou = lead.negociacoes.some(
        n => n.status.nome_status.toUpperCase() === 'GANHA'
      );
      if (ganhou) convertedLeads++;
    });
    const conversionRate = totalLeads > 0
      ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(2))
      : 0;

    // bySource
    const sourceMap: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.origem.nome_origem;
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const bySource = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

    // byStore
    const storeMap: Record<string, number> = {};
    leads.forEach(l => {
      const st = l.loja.nome_loja;
      storeMap[st] = (storeMap[st] || 0) + 1;
    });
    const byStore = Object.entries(storeMap).map(([store, count]) => ({ store, count }));

    // byTeam
    const teamMap: Record<string, number> = {};
    leads.forEach(l => {
      const team = l.usuario.equipe?.nome_equipe ?? 'Sem equipe';
      teamMap[team] = (teamMap[team] || 0) + 1;
    });
    const byTeam = Object.entries(teamMap).map(([team, count]) => ({ team, count }));

    // Todas as negociações dos leads filtrados
    const allNegs = leads.flatMap(l => l.negociacoes);

    // byStatus
    const statusMap: Record<string, number> = {};
    allNegs.forEach(n => {
      const s = n.status.nome_status;
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const byStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    // byImportance
    const impMap: Record<string, number> = {};
    allNegs.forEach(n => {
      const imp = n.importancia_negociacao;
      impMap[imp] = (impMap[imp] || 0) + 1;
    });
    const byImportance = Object.entries(impMap).map(([importance, count]) => ({ importance, count }));

    // funnel (por estágio)
    const funnelMap: Record<string, number> = {};
    allNegs.forEach(n => {
      const stage = n.estagio.nome_estagio;
      funnelMap[stage] = (funnelMap[stage] || 0) + 1;
    });
    const funnel = Object.entries(funnelMap).map(([stage, count]) => ({ stage, count }));

    // convertedVsNonConverted
    const convertedVsNonConverted = [
      { name: 'Convertidos', value: convertedLeads },
      { name: 'Não Convertidos', value: totalLeads - convertedLeads }
    ];

    // lossReasons
    const lossMap: Record<string, number> = {};
    allNegs.forEach(n => {
      const st = n.status.nome_status.toUpperCase();
      if ((st === 'PERDIDA' || st === 'CANCELADA') && n.motivo_finalizacao_negociacao) {
        const r = n.motivo_finalizacao_negociacao;
        lossMap[r] = (lossMap[r] || 0) + 1;
      }
    });
    const lossReasons = Object.entries(lossMap).map(([reason, count]) => ({ reason, count }));

    // performance (por atendente)
    const perfMap: Record<string, { leads: number; conversions: number }> = {};
    leads.forEach(l => {
      const agent = l.usuario.nome_usuario;
      if (!perfMap[agent]) perfMap[agent] = { leads: 0, conversions: 0 };
      perfMap[agent].leads++;
      const ganhou = l.negociacoes.some(
        n => n.status.nome_status.toUpperCase() === 'GANHA'
      );
      if (ganhou) perfMap[agent].conversions++;
    });
    const performance = Object.entries(perfMap).map(([agent, v]) => ({ agent, ...v }));

    // evolution (leads e conversões agrupados por dia)
    const evoMap: Record<string, { leads: number; conversions: number }> = {};
    leads.forEach(l => {
      const day = l.data_criacao_lead.toISOString().slice(0, 10);
      if (!evoMap[day]) evoMap[day] = { leads: 0, conversions: 0 };
      evoMap[day].leads++;
      const ganhou = l.negociacoes.some(
        n => n.status.nome_status.toUpperCase() === 'GANHA'
      );
      if (ganhou) evoMap[day].conversions++;
    });
    const evolution = Object.entries(evoMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));

    return {
      kpis: {
        totalLeads,
        convertedLeads,
        conversionRate,
        avgDealValue: 0,
        totalRevenue: 0
      },
      funnel,
      bySource,
      byStatus,
      byImportance,
      byStore,
      convertedVsNonConverted,
      byTeam,
      avgTimeToFirstContact: 'N/A',
      evolution,
      performance,
      lossReasons
    };
  }
}
