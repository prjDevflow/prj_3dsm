import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateEquipeService } from '../services/CreateEquipeService';
import { UpdateEquipeService } from '../services/UpdateEquipeService';
import { DeleteEquipeService } from '../services/DeleteEquipeService';

const prisma = new PrismaClient();

function mapEquipe(e: any) {
  const manager = e.usuarios?.find((u: any) =>
    u.papel?.nome_papel === 'GERENTE' || u.papel?.nome_papel === 'GERENTE_GERAL'
  );
  return {
    id:          e.id_equipe,
    name:        e.nome_equipe,
    description: '',
    managerId:   manager?.id_usuario ?? null,
    managerName: manager?.nome_usuario ?? null,
    members:     (e.usuarios ?? []).map((u: any) => u.id_usuario),
    memberCount: (e.usuarios ?? []).length,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
}

export class EquipesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, nome, members } = request.body;
    const usuarioLogadoId = request.user.id;

    const createEquipeService = new CreateEquipeService();
    const equipe = await createEquipeService.execute({ nome: name ?? nome, usuarioLogadoId });

    // Assign selected members to the new team
    if (Array.isArray(members) && members.length > 0) {
      await prisma.usuario.updateMany({
        where: { id_usuario: { in: members } },
        data:  { id_equipe: equipe.id_equipe },
      });
    }

    return response.status(201).json(equipe);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const equipes = await prisma.equipe.findMany({
      include: { usuarios: { include: { papel: true } } },
    });
    return response.status(200).json(equipes.map(mapEquipe));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, nome, members } = request.body;
    const usuarioLogadoId = request.user.id;

    const updateEquipeService = new UpdateEquipeService();
    await updateEquipeService.execute({ id, nome: name ?? nome, usuarioLogadoId });

    // Update member assignments: set id_equipe for selected users, clear for removed ones
    if (Array.isArray(members)) {
      // Detach all current members of this team
      await prisma.usuario.updateMany({
        where: { id_equipe: id },
        data:  { id_equipe: null },
      });
      // Attach selected members
      if (members.length > 0) {
        await prisma.usuario.updateMany({
          where: { id_usuario: { in: members } },
          data:  { id_equipe: id },
        });
      }
    }

    // Return updated team with fresh data
    const equipe = await prisma.equipe.findUnique({
      where: { id_equipe: id },
      include: { usuarios: { include: { papel: true } } },
    });

    return response.status(200).json(mapEquipe(equipe));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const usuarioLogadoId = request.user.id;

    // Detach all members before deleting so FK constraint doesn't block
    await prisma.usuario.updateMany({
      where: { id_equipe: id },
      data:  { id_equipe: null },
    });

    const deleteEquipeService = new DeleteEquipeService();
    await deleteEquipeService.execute({ id, usuarioLogadoId });

    return response.status(204).send();
  }
}
