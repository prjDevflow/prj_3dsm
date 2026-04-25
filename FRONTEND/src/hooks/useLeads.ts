import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Lead, Negotiation } from '../types';

interface FetchLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  importance?: string;
  dateRange?: { start: Date; end: Date };
  store?: string;
  team?: string;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchLeads = async (params: FetchLeadsParams): Promise<LeadsResponse> => {
  const { dateRange, store, team, ...rest } = params;
  const queryParams: Record<string, unknown> = { ...rest };

  if (dateRange) {
    queryParams.startDate = dateRange.start.toISOString();
    queryParams.endDate   = dateRange.end.toISOString();
  }
  if (store && store !== 'all') queryParams.store = store;
  if (team  && team  !== 'all') queryParams.team  = team;

  const { data } = await api.get<LeadsResponse>('/leads', { params: queryParams });
  return data;
};

const fetchLeadById = async (id: string): Promise<Lead> => {
  const { data } = await api.get<Lead>(`/leads/${id}`);
  return data;
};

const fetchNegotiations = async (leadId: string): Promise<Negotiation[]> => {
  const { data } = await api.get<Negotiation[]>(`/leads/${leadId}/negotiations`);
  return data;
};

export const useLeads = (params: FetchLeadsParams) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => fetchLeads(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Lead>) => api.post<Lead>('/leads', body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Lead> & { id: string }) =>
      api.put<Lead>(`/leads/${id}`, body).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', vars.id] });
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => fetchLeadById(id),
    enabled: !!id, // Só executa se tiver um ID
  });
};

export const useNegotiations = (leadId: string) => {
  return useQuery({
    queryKey: ['negotiations', leadId],
    queryFn: () => fetchNegotiations(leadId),
    enabled: !!leadId,
  });
};