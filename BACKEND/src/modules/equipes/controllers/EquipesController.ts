import { Request, Response } from 'express';
import { CreateEquipeService } from '../services/CreateEquipeService';
import { ListEquipesService } from '../services/ListEquipesService';
import { UpdateEquipeService } from '../services/UpdateEquipeService';
import { DeleteEquipeService } from '../services/DeleteEquipeService';

export class EquipesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { nome } = request.body;
    const usuarioLogadoId = request.user.id;

    const createEquipeService = new CreateEquipeService();
    const equipe = await createEquipeService.execute({ nome, usuarioLogadoId });

    return response.status(201).json(equipe);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const listEquipesService = new ListEquipesService();
    const equipes = await listEquipesService.execute();

    return response.status(200).json(equipes);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { nome } = request.body;
    const usuarioLogadoId = request.user.id;

    const updateEquipeService = new UpdateEquipeService();
    const equipe = await updateEquipeService.execute({ id, nome, usuarioLogadoId });

    return response.status(200).json(equipe);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const usuarioLogadoId = request.user.id;

    const deleteEquipeService = new DeleteEquipeService();
    await deleteEquipeService.execute({ id, usuarioLogadoId });

    return response.status(204).send();
  }
}