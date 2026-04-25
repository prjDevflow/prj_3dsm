import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Client } from '../types';

interface FetchClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  assignedTo?: string;
}

interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchClients = async (params: FetchClientsParams): Promise<ClientsResponse> => {
  const { data } = await api.get<ClientsResponse>('/clients', { params });
  return data;
};

export const useClients = (params: FetchClientsParams) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => fetchClients(params),
    placeholderData: prev => prev,
  });
};

export const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Client>) => api.post<Client>('/clients', body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Client> & { id: string }) =>
      api.put<Client>(`/clients/${id}`, body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useDeleteClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};
