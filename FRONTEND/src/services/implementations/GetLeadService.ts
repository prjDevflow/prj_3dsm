import { IGetService, FetchLeadsParams } from "../ILeadsService";
import InstanceApi from "../instanceApi";

export class GetLeadService implements IGetService {
  async exec(params: FetchLeadsParams): Promise<{
    leads: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { data } = await InstanceApi.get("leads", { params });

    return {
      leads: data.data,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  }
}
