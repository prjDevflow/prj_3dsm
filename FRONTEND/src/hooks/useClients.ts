import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InstanceApi from '../services/instanceApi';
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
  const { data } = await InstanceApi.get<ClientsResponse>('/clientes', { params });
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
    mutationFn: (body: Partial<Client>) => InstanceApi.post<Client>('/clientes', body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Client> & { id: string }) =>
      InstanceApi.put<Client>(`/clientes/${id}`, body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useDeleteClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InstanceApi.delete(`/clientes/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};
