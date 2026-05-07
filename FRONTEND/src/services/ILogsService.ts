export interface ILog {
  id: string;
  action: string;
  entityType: string;
  entityName?: string;
  details: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface IGetLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

export interface IGetLogsResponse {
  data: ILog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ILogsService {
  getLogs(params?: IGetLogsParams): Promise<IGetLogsResponse>;
}