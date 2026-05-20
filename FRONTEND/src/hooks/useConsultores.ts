import { useQuery } from '@tanstack/react-query';
import InstanceApi from '../services/instanceApi';

export interface Consultor {
  id:   string;
  name: string;
  role: string;
}

const fetchConsultores = async (): Promise<Consultor[]> => {
  const { data } = await InstanceApi.get<Consultor[]>('/consultores');
  return data;
};

export const useConsultores = () => {
  return useQuery({
    queryKey: ['consultores'],
    queryFn:  fetchConsultores,
    staleTime: 5 * 60 * 1000,
  });
};
