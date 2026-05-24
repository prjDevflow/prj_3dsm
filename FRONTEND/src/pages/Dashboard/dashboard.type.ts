import { IDashboardMetricsResponse } from "../../services/IDashboardService";

export type DashboardViewModel = {
  kpis: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: string;
    totalRevenue: number;
    avgDealValue?: number;
  };
  funnel: { stage: string; count: number }[];
  evolution: { date: string; leads: number; conversions: number }[];
  bySource: { source: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byImportance: { importance: string; count: number }[];
  byStore: { store: string; count: number }[];
  convertedVsNonConverted: { name: string; value: number }[];
  byTeam: { team: string; count: number }[];
  performance: { agent: string; leads: number; conversions: number }[];
  performanceByTeam: { team: string; leads: number; conversions: number }[];
  lossReasons: { reason: string; count: number }[];
  avgTimeToFirstContact: string;
};

export const mapToViewModel = (
  data: IDashboardMetricsResponse,
): DashboardViewModel => {
  return {
    kpis: {
      totalLeads:     data.kpis?.totalLeads     ?? 0,
      convertedLeads: data.kpis?.convertedLeads ?? 0,
      conversionRate: String(data.kpis?.conversionRate ?? 0),
      totalRevenue:   data.kpis?.totalRevenue   ?? 0,
      avgDealValue:   data.kpis?.avgDealValue   ?? 0,
    },
    funnel:                  data.funnel                  ?? [],
    evolution:               data.evolution               ?? [],
    bySource:                data.bySource                ?? [],
    byStatus:                data.byStatus                ?? [],
    byImportance:            data.byImportance            ?? [],
    byStore:                 data.byStore                 ?? [],
    convertedVsNonConverted: data.convertedVsNonConverted ?? [],
    byTeam:                  data.byTeam                  ?? [],
    performance:             data.performance             ?? [],
    performanceByTeam:       data.performanceByTeam       ?? [],
    lossReasons:             data.lossReasons             ?? [],
    avgTimeToFirstContact:   data.avgTimeToFirstContact   ?? "N/A",
  };
};
