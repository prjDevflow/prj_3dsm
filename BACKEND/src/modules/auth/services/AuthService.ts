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
      throw new Error("E-mail ou palavra-passe incorretos.");
    }

    // 2. Compara a palavra-passe informada com o hash armazenado no banco (RNF02)
    const passwordMatch = await compare(senha, user.senha);

    if (!passwordMatch) {
      throw new Error("E-mail ou palavra-passe incorretos.");
    }

    // 3. Gera o Token JWT (RF01)
    // A chave secreta deve vir das variáveis de ambiente (.env)
    const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao_desenvolvimento';
    
    const token = sign(
      { role: user.role }, // Payload: Papel (role) injetado para o Middleware RBAC
      secret,
      {
        subject: user.id,    // Identificador do utilizador
        expiresIn: '1d'      // Tempo de expiração
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
        nome: user.nome,
        email: user.email,
        role: user.role,
        equipeId: user.equipeId
      },
      token
    };
  }
}