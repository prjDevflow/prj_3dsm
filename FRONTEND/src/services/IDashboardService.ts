export interface IDashboardMetricsRequest {
  start?: string;
  end?: string;
}

export interface IDashboardMetricsResponse {
  kpis: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    avgDealValue: number;
    totalRevenue: number;
  };
  funnel: { stage: string; count: number }[];
  bySource: { source: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byImportance: { importance: string; count: number }[];
  byStore: { store: string; count: number }[];
  convertedVsNonConverted: { name: string; value: number }[];
  byTeam: { team: string; count: number }[];
  avgTimeToFirstContact: string;
  evolution: { date: string; leads: number; conversions: number }[];
  performance: { agent: string; leads: number; conversions: number }[];
  performanceByTeam: { team: string; leads: number; conversions: number }[];
  lossReasons: { reason: string; count: number }[];
}

export interface IDashboardService {
  getMetrics(params?: IDashboardMetricsRequest): Promise<IDashboardMetricsResponse>;
}
