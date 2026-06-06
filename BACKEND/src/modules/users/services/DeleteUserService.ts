import { AppError } from '../../../shared/errors/AppError';
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
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Regra de segurança: O Admin não deve conseguir excluir a si mesmo
    if (id === usuarioLogadoId) {
      throw new AppError("Não é permitido excluir o próprio usuário ativo.", 400);
    }

    await this.usersRepository.softDelete(id);

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.DELETE,
      entidade: 'USUARIO',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId,
      detalhes: `Usuário '${user.nome_usuario}' (${user.email_usuario}) excluído`,
    });
  }
}