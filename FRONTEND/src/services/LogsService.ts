import InstanceApi from './instanceApi';
import {
  ILogsService,
  IGetLogsParams,
  IGetLogsResponse,
  ILog,
} from './ILogsService';

interface IApiLog {
  id_log: string;
  acao_log: string;
  tabela_afetada_log: string;
  data_hora_log: string;
  usuario: {
    nome_usuario: string;
    email_usuario: string;
  };
}

interface IApiGetLogsResponse {
  data: IApiLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class LogsService implements ILogsService {
  private api = InstanceApi;

  private mapApiLogToLog(log: IApiLog): ILog {
    return {
      id: log.id_log,
      action: log.acao_log.toLowerCase(),
      entityType: log.tabela_afetada_log.toLowerCase(),
      entityName: '', // Backend não fornece nome da entidade afetada
      details: `Operação ${log.acao_log} na entidade ${log.tabela_afetada_log}`,
      userName: log.usuario.nome_usuario,
      userEmail: log.usuario.email_usuario,
      ipAddress: '', // Backend não fornece IP
      userAgent: '', // Backend não fornece user agent
      createdAt: log.data_hora_log,
    };
  }

  async getLogs(params?: IGetLogsParams): Promise<IGetLogsResponse> {
    const queryParams: Record<string, unknown> = {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      action: params?.action,
      entityType: params?.entityType,
      startDate: params?.startDate,
      endDate: params?.endDate,
    };

    const response = await this.api.get<IApiGetLogsResponse>('/logs', {
      params: queryParams,
    });

    return {
      ...response.data,
      data: response.data.data.map(this.mapApiLogToLog),
    };
  }
}