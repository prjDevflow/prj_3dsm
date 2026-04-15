import { useQuery } from '@tanstack/react-query';
import api from '../services/instanceApi';
import { DashboardMetrics } from '../types';
import { DateRange, validateDateRange } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export interface DashboardFilters {
  dateRange?: DateRange;
  store?: string;
  team?: string;
}

const fetchDashboardMetrics = async (filters?: DashboardFilters): Promise<DashboardMetrics> => {
  const params = new URLSearchParams();
  
  if (filters?.dateRange) {
    params.append('startDate', filters.dateRange.start.toISOString());
    params.append('endDate', filters.dateRange.end.toISOString());
  }
  
  if (filters?.store && filters.store !== 'all') {
    params.append('store', filters.store);
  }
  
  if (filters?.team && filters.team !== 'all') {
    params.append('team', filters.team);
  }
  
  const { data } = await api.get<DashboardMetrics>('/dashboard/metrics', { params });
  return data;
};

export const useDashboardMetrics = (filters?: DashboardFilters) => {
  const { user } = useAuth();
  
  // Validar período antes de enviar
  const validatedFilters = { ...filters };
  
  if (filters?.dateRange) {
    const isAdmin = user?.role === 'admin' || user?.role === 'gerente_geral';
    const validation = validateDateRange(filters.dateRange, isAdmin);
    
    if (validation.adjustedRange) {
      validatedFilters.dateRange = validation.adjustedRange;
    }
  }

  return useQuery({
    queryKey: ['dashboardMetrics', validatedFilters],
    queryFn: () => fetchDashboardMetrics(validatedFilters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};