import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { User, LoginCredentials, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mapeia o role vindo do backend (MAIÚSCULAS) para o formato do frontend (minúsculas)
function mapRole(backendRole: string): UserRole {
  const map: Record<string, UserRole> = {
    ADMIN: 'admin',
    GERENTE_GERAL: 'gerente_geral',
    GERENTE: 'gerente',
    ATENDENTE: 'atendente',
  };
  return map[backendRole] ?? (backendRole.toLowerCase() as UserRole);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('@dashboard:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await axios.post('/api/sessions', {
        email: credentials.email,
        senha: credentials.password,
      });

      const { user: backendUser, token } = response.data;

      const mappedUser: User = {
        id: backendUser.id,
        name: backendUser.name ?? backendUser.nome,
        email: backendUser.email,
        role: mapRole(backendUser.role),
        teamId: backendUser.teamId ?? backendUser.equipeId ?? undefined,
        active: true,
        createdAt: backendUser.createdAt ?? new Date().toISOString(),
        updatedAt: backendUser.updatedAt ?? new Date().toISOString(),
      };

      setUser(mappedUser);
      localStorage.setItem('@dashboard:user', JSON.stringify(mappedUser));
      localStorage.setItem('@dashboard:token', token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@dashboard:user');
    localStorage.removeItem('@dashboard:token');
  };

  const hasRole = (roles: User['role'][]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};