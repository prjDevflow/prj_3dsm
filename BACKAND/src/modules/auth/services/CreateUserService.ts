import { hash } from 'bcryptjs';
import { UsersRepository } from '../repositories/UsersRepository';

export class CreateUserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async execute({ nome, email, senha, role }: any) {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Usuário já cadastrado.");
    }

    // RNF02 - Criptografia de senha com Salt de 8 rounds
    const passwordHash = await hash(senha, 8);

    const user = {
      id: Math.random().toString(36).substring(2, 9),
      nome,
      email,
      senha: passwordHash,
      role,
      criadoEm: new Date()
    };

    console.log("Usuário criado com hash:", user.senha);
    return user;
  }
}