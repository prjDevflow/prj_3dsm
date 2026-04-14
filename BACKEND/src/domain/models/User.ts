import { UserRole } from './UserRole';

export class User {
  id!: string;
  nome!: string;
  email!: string; // Usado para autenticação (RF01) [cite: 54]
  senha!: string; // Deve ser Bcrypt (RNF02) 
  role!: UserRole; // Define o que o usuário "Pode" ou "Não pode" (RF02) 
  equipeId?: string; // Vinculo para Gerentes e Atendentes [cite: 74, 85]
  criadoEm!: Date;
}