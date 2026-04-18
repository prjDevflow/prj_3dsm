import { hash } from 'bcryptjs';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IUpdateCredentialsRequest {
  userId: string;
  email?: string;
  senha?: string;
}

export class UpdateUserCredentialsService {
  private usersRepository: UsersRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ userId, email, senha }: IUpdateCredentialsRequest) {
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
      const hashedPassword = await hash(senha, 10);
      user.senha = hashedPassword; // Atualiza a propriedade com o hash gerado
    }

    // 4. Salva as alterações na base de dados (PostgreSQL via Prisma)
    const updatedUser = await this.usersRepository.save(user);

    // 5. Rastreabilidade (RF07): Registra a ação no banco
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'USUARIO',
      entidadeId: user.id,
      usuarioResponsavelId: userId // O próprio utilizador fez a alteração
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