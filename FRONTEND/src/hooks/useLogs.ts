import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
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

const fetchLogs = async (filters: LogsFilters): Promise<LogsResponse> => {
  const { dateRange, ...rest } = filters;
  const params: Record<string, unknown> = { ...rest };
  if (dateRange) {
    params.startDate = dateRange.start.toISOString();
    params.endDate   = dateRange.end.toISOString();
  }
  const { data } = await api.get<LogsResponse>('/logs', { params });
  return data;
};

export const useLogs = (filters: LogsFilters) => {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: () => fetchLogs(filters),
    placeholderData: prev => prev,
  });
};
