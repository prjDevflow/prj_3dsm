import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Lead, Negotiation } from '../types';

interface FetchLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  importance?: string;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchLeads = async (params: FetchLeadsParams): Promise<LeadsResponse> => {
  const { data } = await api.get<LeadsResponse>('/leads', { params });
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