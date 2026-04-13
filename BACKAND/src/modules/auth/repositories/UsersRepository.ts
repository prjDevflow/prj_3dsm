import { User } from "../../../domain/models/User";

export class UsersRepository {
  private users: User[] = [
    {
      id: '1',
      nome: 'Matheus Admin',
      email: 'admin@1000valle.com.br',
      senha: '$2a$08$H66pZ28ui0.6VqYp.L6vxeuH.vR3.B3I7u6q6v6v6v6v6v6v6v6v6', // senha: '123'
      role: 'ADMIN' as any,
      criadoEm: new Date()
    }
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}