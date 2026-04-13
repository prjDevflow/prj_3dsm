import { useQuery } from '@tanstack/react-query';
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