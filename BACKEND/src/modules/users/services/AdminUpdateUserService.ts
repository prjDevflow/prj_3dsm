import { PrismaClient } from '@prisma/client';
import { UsersManagementRepository } from '../repositories/UsersManagementRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

const prisma = new PrismaClient();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    // Resolve papelId: aceita nome ('atendente') ou UUID diretamente
    let resolvedPapelId = papelId;
    if (papelId && !UUID_RE.test(papelId)) {
      const papel = await prisma.papel.findFirst({
        where: { nome_papel: { equals: papelId, mode: 'insensitive' } }
      });
      if (!papel) {
        const error = new Error(`Papel '${papelId}' não encontrado.`);
        (error as any).statusCode = 400;
        throw error;
      }
      resolvedPapelId = papel.id_papel;
    }

    const updatedUser = await this.usersRepository.update(id, {
      nome_usuario: nome,
      id_papel: resolvedPapelId,
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