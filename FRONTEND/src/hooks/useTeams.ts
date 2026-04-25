import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Team } from '../types';

const fetchTeams = async (): Promise<Team[]> => {
  const { data } = await api.get<Team[]>('/teams');
  return data;
};

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
};

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Team>) => api.post<Team>('/teams', body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  });
};

export const useUpdateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Team> & { id: string }) =>
      api.put<Team>(`/teams/${id}`, body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  });
};

export const useDeleteTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/teams/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  });
};
