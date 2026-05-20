import { Request, Response } from 'express';
import { ListUsersService } from '../services/ListUsersService';
import { AdminUpdateUserService } from '../services/AdminUpdateUserService';
import { DeleteUserService } from '../services/DeleteUserService';

function mapUserToDTO(u: any) {
  return {
    id:        u.id_usuario,
    name:      u.nome_usuario,
    email:     u.email_usuario,
    role:      u.papel?.nome_papel?.toLowerCase() ?? u.role ?? '',
    teamId:    u.id_equipe ?? u.equipe?.id_equipe ?? null,
    active:    u.ativo_usuario ?? true,
    createdAt: u.data_criacao_usuario?.toISOString() ?? new Date().toISOString(),
    updatedAt: u.data_criacao_usuario?.toISOString() ?? new Date().toISOString(),
  };
}

export class UsersManagementController {
  async list(request: Request, response: Response): Promise<Response> {
    const page  = Math.max(1, parseInt((request.query.page as string) ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((request.query.limit as string) ?? '20', 10)));

    const listUsersService = new ListUsersService();
    const allUsers = await listUsersService.execute();

    const total      = allUsers.length;
    const totalPages = Math.ceil(total / limit);
    const paged      = allUsers.slice((page - 1) * limit, page * limit);

    return response.status(200).json({
      data: paged.map(mapUserToDTO),
      total,
      page,
      limit,
      totalPages,
    });
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    // aceita inglês (name, role, teamId) ou português (nome, papelId, equipeId)
    const { name, nome, role, papelId, teamId, equipeId, active } = request.body;
    const usuarioLogadoId = request.user.id;

    const adminUpdateUserService = new AdminUpdateUserService();
    const user = await adminUpdateUserService.execute({
      id,
      nome:     name ?? nome,
      papelId:  role ?? papelId,
      equipeId: teamId ?? equipeId,
      ativo:    active,
      usuarioLogadoId,
    });

    return response.status(200).json(mapUserToDTO(user));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const usuarioLogadoId = request.user.id;

    const deleteUserService = new DeleteUserService();
    await deleteUserService.execute({ id, usuarioLogadoId });

    return response.status(204).send();
  }
}