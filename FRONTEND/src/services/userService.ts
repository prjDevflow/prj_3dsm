import api from './api';

interface UpdateEmailData {
  newEmail: string;
  password: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  // Atualizar email
  updateEmail: async (data: UpdateEmailData) => {
    const response = await api.put('/users/email', data);
    return response.data;
  },

  // Atualizar senha
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  // Validar senha atual (mock)
  validatePassword: async (password: string) => {
    // Mock: sempre true por enquanto
    return true;
  }
};