import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IAuthRequest {
  email: string;
  senha: string;
}

export class AuthService {
  private usersRepository: UsersRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ email, senha }: IAuthRequest) {
    // 1. Verifica se o utilizador existe (a busca já ocorre no PostgreSQL via Prisma)
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail incorreto.");
    }

    // 2. Compara a palavra-passe informada com o hash armazenado no banco (RNF02)
    const passwordMatch = await compare(senha, user.senha);

    if (!passwordMatch) {
      throw new Error("Senha incorreta.");
    }

    // 3. Gera o Token JWT (RF01)
    // A chave secreta deve vir das variáveis de ambiente (.env)
    const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao_desenvolvimento';
    
    const token = sign(
      { role: user.role, equipeId: user.equipeId ?? null },
      secret,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    // 4. Regista o Log de Acesso (RF07)
    // Assim que o login é validado, gravamos a auditoria na base de dados
    await this.createLogService.execute({
      acao: LogAction.LOGIN,
      entidade: 'USUARIO',
      entidadeId: user.id,
      usuarioResponsavelId: user.id
    });

    // 5. Retorna os dados do utilizador e o token (omitindo a palavra-passe por segurança)
    return {
      user: {
        id: user.id,
        name: user.nome,      // inglês para o frontend
        nome: user.nome,      // português mantido por compatibilidade
        email: user.email,
        role: user.role,
        teamId: user.equipeId, // inglês para o frontend
        equipeId: user.equipeId,
      },
      token
    };
  }
}