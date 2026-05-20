import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UpdateLeadService } from '../services/UpdateLeadService';

const prisma = new PrismaClient();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class UpdateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    let { lojaId, origemId, atendenteId } = request.body;
    const { store, origin, assignedTo } = request.body;

    const usuarioLogadoId      = request.user.id;
    const usuarioLogadoRole    = request.user.role;
    const usuarioLogadoEquipeId = request.user.equipeId;

    // Resolve lojaId from store name
    if (!lojaId && store) {
      if (UUID_RE.test(store)) {
        lojaId = store;
      } else {
        const loja = await prisma.loja.findFirst({
          where: { nome_loja: { equals: store, mode: 'insensitive' } },
        });
        if (!loja) return response.status(400).json({ error: `Loja '${store}' não encontrada.` });
        lojaId = loja.id_loja;
      }
    }

    // Resolve origemId from origin name
    if (!origemId && origin) {
      if (UUID_RE.test(origin)) {
        origemId = origin;
      } else {
        let origem = await prisma.origem.findFirst({
          where: { nome_origem: { equals: origin, mode: 'insensitive' } },
        });
        if (!origem) {
          origem = await prisma.origem.create({ data: { nome_origem: origin } });
        }
        origemId = origem.id_origem;
      }
    }

    // assignedTo alias
    if (!atendenteId && assignedTo) atendenteId = assignedTo;

    const updateLeadService = new UpdateLeadService();
    const lead = await updateLeadService.execute({
      leadId: id,
      lojaId,
      origemId,
      atendenteId,
      usuarioLogadoId,
      usuarioLogadoRole,
      usuarioLogadoEquipeId,
    });

    return response.status(200).json(lead);
  }
}
