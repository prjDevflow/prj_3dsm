import { useQuery } from '@tanstack/react-query';
import { LogsService } from '../services/LogsService';
import { Log } from '../types';

interface LogsFilters {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entityType?: string;
  dateRange?: { start: Date; end: Date };
}

interface LogsResponse {
  data: Log[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const logsService = new LogsService();

const fetchLogs = async (filters: LogsFilters): Promise<LogsResponse> => {
  const { dateRange, ...rest } = filters;
  const result = await logsService.getLogs({
    ...rest,
    ...(dateRange && {
      startDate: dateRange.start.toISOString(),
      endDate:   dateRange.end.toISOString(),
    }),
  });

  return {
    ...result,
    data: result.data.map(log => ({
      id:         log.id,
      userId:     '',
      userName:   log.userName,
      userEmail:  log.userEmail,
      action:     log.action as Log['action'],
      entityType: log.entityType as Log['entityType'],
      entityId:   undefined,
      entityName: log.entityName,
      details:    log.details,
      ipAddress:  log.ipAddress,
      userAgent:  log.userAgent,
      createdAt:  log.createdAt,
    })),
  };
};

export const useLogs = (filters: LogsFilters) => {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: () => fetchLogs(filters),
    placeholderData: (previousData) => previousData,
  });
};
