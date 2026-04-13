import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { User } from '../types';

interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  teamId?: string;
}

interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchUsers = async (params: FetchUsersParams): Promise<UsersResponse> => {
  const { data } = await api.get<UsersResponse>('/users', { params });
  return data;
};

const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await api.post<User>('/users', user);
  return data;
};

const updateUser = async ({ id, ...user }: Partial<User> & { id: string }) => {
  const { data } = await api.put<User>(`/users/${id}`, user);
  return data;
};

const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};

export const useUsers = (params: FetchUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};