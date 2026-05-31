import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

const prisma = new PrismaClient();

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
      usuarioResponsavelId: user.id,
      detalhes: `Login realizado por ${user.nome} (${user.email})`,
    });

    // 5. Carrega capabilities do papel + extras do usuário
    const papelData = await prisma.usuario.findUnique({
      where: { id_usuario: user.id },
      select: { papel: { select: { capabilities: true } }, permissoes_extras: true },
    });
    const roleCaps = (papelData?.papel?.capabilities as any) ?? {};
    const extras   = (papelData?.permissoes_extras as any) ?? {};
    const capabilities = {
      pages:   { ...roleCaps.pages,   ...(extras.pages   ?? {}) },
      actions: { ...roleCaps.actions, ...(extras.actions ?? {}) },
    };

    // 6. Retorna os dados do utilizador e o token
    return {
      user: {
        id:           user.id,
        name:         user.nome,
        nome:         user.nome,
        email:        user.email,
        role:         user.role,
        teamId:       user.equipeId,
        equipeId:     user.equipeId,
        capabilities,
      },
      token
    };
  }
}