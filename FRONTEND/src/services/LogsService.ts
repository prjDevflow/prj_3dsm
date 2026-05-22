import InstanceApi from './instanceApi';
import { ILogsService, IGetLogsParams, IGetLogsResponse } from './ILogsService';

export class LogsService implements ILogsService {
  private api = InstanceApi;

  async getLogs(params?: IGetLogsParams): Promise<IGetLogsResponse> {
    const response = await this.api.get<IGetLogsResponse>('/logs', {
      params: {
        page:       params?.page,
        limit:      params?.limit,
        search:     params?.search,
        action:     params?.action,
        entityType: params?.entityType,
        startDate:  params?.startDate,
        endDate:    params?.endDate,
      },
    });

    return response.data;
  }
}
