import { hash, compare } from 'bcryptjs';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IUpdateCredentialsRequest {
  userId: string;
  email?: string;
  senha?: string;
  senhaAtual?: string;
}

export class UpdateUserCredentialsService {
  private usersRepository: UsersRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ userId, email, senha, senhaAtual }: IUpdateCredentialsRequest) {
    // 1. Busca o utilizador no banco de dados
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // 2. Regra de Negócio: Atualização de E-mail
    if (email && email !== user.email) {
      const emailExists = await this.usersRepository.findByEmail(email);
      if (emailExists) {
        throw new Error("Este e-mail já está em uso por outro usuário.");
      }
      user.email = email;
    }

    // 3. Regra de Negócio: Atualização de Senha com Hash Seguro (RNF02)
    if (senha) {
      if (!senhaAtual) {
        const error = new Error("A senha atual é obrigatória para alterar a senha.");
        (error as any).statusCode = 400;
        throw error;
      }
      const passwordMatch = await compare(senhaAtual, user.senha);
      if (!passwordMatch) {
        const error = new Error("Senha atual incorreta.");
        (error as any).statusCode = 400;
        throw error;
      }
      const hashedPassword = await hash(senha, 10);
      user.senha = hashedPassword;
    }

    // 4. Salva as alterações na base de dados (PostgreSQL via Prisma)
    const updatedUser = await this.usersRepository.save(user);

    // 5. Rastreabilidade (RF07): Registra a ação no banco
    const alteracoes: string[] = [];
    if (email && email !== user.email) alteracoes.push('email');
    if (senha) alteracoes.push('senha');

    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'USUARIO',
      entidadeId: user.id,
      usuarioResponsavelId: userId,
      detalhes: `Credenciais de '${user.nome}' atualizadas — campos: ${alteracoes.join(', ') || 'nenhum campo alterado'}`,
    });

    // Retorna os dados atualizados omitindo a senha para segurança
    return {
      id: updatedUser.id,
      nome: updatedUser.nome,
      email: updatedUser.email,
      role: updatedUser.role
    };
  }
}