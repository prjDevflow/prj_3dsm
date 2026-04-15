import { IGetService, FetchLeadsParams } from "../ILeadsService";
import InstanceApi from "../instanceApi";

export class GetLeadService implements IGetService {
  async exec(params: FetchLeadsParams): Promise<{
    data: {
      data: any;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { data } = await InstanceApi.get("leads", { params });

    return {
      data: {
        data: data.data,
        limit: data.limit,
        page: data.page,
        total: data.page,
        totalPages: data.totalPages,
      },
    };
  }
}
