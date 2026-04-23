import { UsersManagementRepository } from '../repositories/UsersManagementRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IAdminUpdateUserRequest {
  id: string;
  nome?: string;
  papelId?: string;
  equipeId?: string | null;
  usuarioLogadoId: string;
}

export class AdminUpdateUserService {
  private usersRepository: UsersManagementRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersManagementRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ id, nome, papelId, equipeId, usuarioLogadoId }: IAdminUpdateUserRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      const error = new Error("Usuário não encontrado.");
      (error as any).statusCode = 404;
      throw error;
    }

    const updatedUser = await this.usersRepository.update(id, {
      nome_usuario: nome,
      id_papel: papelId,
      id_equipe: equipeId
    });

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'USUARIO',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId
    });

    return updatedUser;
  }
}