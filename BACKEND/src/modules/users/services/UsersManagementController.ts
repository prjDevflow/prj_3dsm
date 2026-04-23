import { Request, Response } from 'express';
import { ListUsersService } from '../services/ListUsersService';
import { AdminUpdateUserService } from '../services/AdminUpdateUserService';
import { DeleteUserService } from '../services/DeleteUserService';

export class UsersManagementController {
  async list(request: Request, response: Response): Promise<Response> {
    const listUsersService = new ListUsersService();
    const users = await listUsersService.execute();

    return response.status(200).json(users);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { nome, papelId, equipeId } = request.body;
    const usuarioLogadoId = request.user.id;

    const adminUpdateUserService = new AdminUpdateUserService();
    const user = await adminUpdateUserService.execute({
      id,
      nome,
      papelId,
      equipeId,
      usuarioLogadoId
    });

    return response.status(200).json(user);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const usuarioLogadoId = request.user.id;

    const deleteUserService = new DeleteUserService();
    await deleteUserService.execute({ id, usuarioLogadoId });

    return response.status(204).send();
  }
}