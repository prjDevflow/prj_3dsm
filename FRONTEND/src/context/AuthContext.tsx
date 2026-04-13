import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';

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

// Mock de usuários com TODOS os campos da interface User
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Atendente Teste',
    email: 'atendente@email.com',
    role: 'atendente',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Gerente Teste',
    email: 'gerente@email.com',
    role: 'gerente',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Admin Teste',
    email: 'admin@email.com',
    role: 'admin',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    role: 'atendente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '8',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    role: 'atendente',
    teamId: '1',
    active: true,
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('@dashboard:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Buscar usuário pelo email e senha
        const foundUser = MOCK_USERS.find(
          (u) => u.email === credentials.email
        );

        // Aceitar qualquer senha 123456 para mock
        if (foundUser && credentials.password === '123456') {
          setUser(foundUser);
          localStorage.setItem('@dashboard:user', JSON.stringify(foundUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@dashboard:user');
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