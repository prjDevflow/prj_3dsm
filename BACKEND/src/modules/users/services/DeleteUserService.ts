import { UsersManagementRepository } from '../repositories/UsersManagementRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IDeleteUserRequest {
  id: string;
  usuarioLogadoId: string;
}

export class DeleteUserService {
  private usersRepository: UsersManagementRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersManagementRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ id, usuarioLogadoId }: IDeleteUserRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      const error = new Error("Usuário não encontrado.");
      (error as any).statusCode = 404;
      throw error;
    }

    // Regra de segurança: O Admin não deve conseguir excluir a si mesmo
    if (id === usuarioLogadoId) {
      const error = new Error("Não é permitido excluir o próprio usuário ativo.");
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      await this.usersRepository.delete(id);
    } catch (err) {
      const error = new Error("Não é possível excluir este usuário pois ele possui vínculos (Leads/Históricos).");
      (error as any).statusCode = 400;
      throw error;
    }

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.DELETE,
      entidade: 'USUARIO',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId
    });
  }
}