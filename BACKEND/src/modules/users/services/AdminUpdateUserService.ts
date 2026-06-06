import { AppError } from '../../../shared/errors/AppError';
import { prisma } from '../../../shared/infra/prisma/client';
import { UsersManagementRepository } from '../repositories/UsersManagementRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface IAdminUpdateUserRequest {
  id: string;
  nome?: string;
  papelId?: string;
  equipeId?: string | null;
  ativo?: boolean;
  usuarioLogadoId: string;
}

export class AdminUpdateUserService {
  private usersRepository: UsersManagementRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.usersRepository = new UsersManagementRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ id, nome, papelId, equipeId, ativo, usuarioLogadoId }: IAdminUpdateUserRequest) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Resolve papelId: aceita nome ('atendente') ou UUID diretamente
    let resolvedPapelId = papelId;
    if (papelId && !UUID_RE.test(papelId)) {
      const papel = await prisma.papel.findFirst({
        where: { nome_papel: { equals: papelId, mode: 'insensitive' } }
      });
      if (!papel) {
        throw new AppError(`Papel '${papelId}' não encontrado.`, 400);
      }
      resolvedPapelId = papel.id_papel;
    }

    const updatedUser = await this.usersRepository.update(id, {
      nome_usuario: nome,
      id_papel: resolvedPapelId,
      id_equipe: equipeId,
      ...(ativo !== undefined ? { ativo_usuario: ativo } : {}),
    });

    const campos: string[] = [];
    if (nome) campos.push('nome');
    if (papelId) campos.push('perfil');
    if (equipeId !== undefined) campos.push('equipe');
    if (ativo !== undefined) campos.push(ativo ? 'reativado' : 'desativado');

    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'USUARIO',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId,
      detalhes: `Dados de '${user.nome_usuario}' (${user.email_usuario}) atualizados — campos: ${campos.join(', ') || 'sem alterações'}`,
    });

    return updatedUser;
  }
}