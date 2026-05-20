import InstanceApi from "../instanceApi";
import { IDashboardService, IDashboardMetricsRequest, IDashboardMetricsResponse } from "../IDashboardService";

export class DashboardService implements IDashboardService {
  async getMetrics(params?: IDashboardMetricsRequest): Promise<IDashboardMetricsResponse> {
    const response = await InstanceApi.get("/dashboard/metrics", {
      params: {
        startDate: params?.start,
        endDate: params?.end,
      },
    });
    return response.data;
  }
}
