import { useQuery } from '@tanstack/react-query';
import api from '../services/instanceApi';

interface Loja {
  id: string;
  nome: string;
}

const fetchLojas = async (): Promise<Loja[]> => {
  const { data } = await api.get<Loja[]>('/lojas');
  return data;
};

export const useLojas = () =>
  useQuery({
    queryKey: ['lojas'],
    queryFn: fetchLojas,
    staleTime: 5 * 60 * 1000,
  });
