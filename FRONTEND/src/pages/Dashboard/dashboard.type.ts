import { IDashboardMetricsResponse } from "../../services/IDashboardService";

export type DashboardViewModel = {
  kpis: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: string;
    totalRevenue: number;
    avgDealValue?: number;
  };

  funnel: any[];
  evolution: any[];

  bySource: any[];
  byStatus: any[];
  byImportance: any[];
  byStore: any[];

  convertedVsNonConverted: any[];
  byTeam: any[];
  performance: any[];
  lossReasons: any[];

  avgTimeToFirstContact: string;
};

export const mapToViewModel = (
  data: IDashboardMetricsResponse,
): DashboardViewModel => {
  return {
    kpis: {
      totalLeads: data.operational?.totalLeads ?? 0,
      convertedLeads: data.analytical?.totalConverted ?? 0,
      conversionRate: data.analytical?.conversionRate ?? "0",
      totalRevenue: 0,
      avgDealValue: data.analytical?.avgDealValue ?? undefined,
    },

    bySource: data.operational?.leadsBySource ?? [],
    byStore: data.operational?.leadsByStore ?? [],

    byImportance: data.analytical?.importanceDistribution ?? [],
    byStatus: data.analytical?.completionReasons ?? [],

    // ❗ não existem no backend → fallback
    funnel: [],
    evolution: [],
    convertedVsNonConverted: [],
    byTeam: [],
    performance: [],
    lossReasons: [],

    avgTimeToFirstContact: "0 dias",
  };
};
