export interface IDashboardMetricsRequest {
  start?: string;
  end?: string;
}

export interface IDashboardMetricsResponse {
  period: {
    start: string;
    end: string;
  };
  operational: {
    totalLeads: number;
    leadsBySource: any[];
    leadsByStore: any[];
  };
  analytical: {
    totalConverted: number;
    totalNotConverted: number;
    conversionRate: string;
    importanceDistribution: any;
    completionReasons: any;
    leadsByAgent: any;
    avgDealValue?: number;
  };
}

export interface IDashboardService {
  getMetrics(params?: IDashboardMetricsRequest): Promise<IDashboardMetricsResponse>;
}
