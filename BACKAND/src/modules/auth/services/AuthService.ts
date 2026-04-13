import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../repositories/UsersRepository';

export class AuthService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async execute({ email, senha }: any) {
    // 1. Busca o usuário real no repositório
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error("Email ou senha incorretos."); // Erro genérico por segurança
    }

    // 2. Compara a senha digitada com o Hash Bcrypt (RNF02)
    const passwordMatch = await compare(senha, user.senha);

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos.");
    }

    // 3. Gera o Token JWT real (RF01)
    // Usamos o segredo definido no seu arquivo .env
    const token = sign(
      { role: user.role }, 
      process.env.JWT_SECRET as string, 
      {
        subject: user.id,
        expiresIn: "1d" // Token válido por 24h
      }
    );

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}