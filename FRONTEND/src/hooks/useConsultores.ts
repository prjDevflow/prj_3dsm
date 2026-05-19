import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface Consultor {
  id:   string;
  name: string;
  role: string;
}

const fetchConsultores = async (): Promise<Consultor[]> => {
  const { data } = await api.get<Consultor[]>('/consultores');
  return data;
};

export const useConsultores = () => {
  return useQuery({
    queryKey: ['consultores'],
    queryFn:  fetchConsultores,
    staleTime: 5 * 60 * 1000,
  });
};
