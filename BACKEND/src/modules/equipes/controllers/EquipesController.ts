import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateEquipeService } from '../services/CreateEquipeService';
import { UpdateEquipeService } from '../services/UpdateEquipeService';
import { DeleteEquipeService } from '../services/DeleteEquipeService';

const prisma = new PrismaClient();

export class EquipesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { nome } = request.body;
    const usuarioLogadoId = request.user.id;

    const createEquipeService = new CreateEquipeService();
    const equipe = await createEquipeService.execute({ nome, usuarioLogadoId });

    return response.status(201).json(equipe);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const equipes = await prisma.equipe.findMany({
      include: { usuarios: { select: { id_usuario: true, nome_usuario: true, papel_usuario: true } } },
    });

    const data = equipes.map(e => {
      const manager = e.usuarios.find(u => u.papel_usuario === 'GERENTE' || u.papel_usuario === 'GERENTE_GERAL');
      return {
        id:          e.id_equipe,
        name:        e.nome_equipe,
        description: '',
        managerId:   manager?.id_usuario ?? null,
        managerName: manager?.nome_usuario ?? null,
        members:     e.usuarios.map(u => u.id_usuario),
        memberCount: e.usuarios.length,
        createdAt:   new Date().toISOString(),
        updatedAt:   new Date().toISOString(),
      };
    });

    return response.status(200).json(data);
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