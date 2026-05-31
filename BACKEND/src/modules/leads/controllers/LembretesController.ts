import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LembretesController {
  // GET /leads/:id/lembretes
  async list(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const lembretes = await prisma.lembrete.findMany({
      where: { id_lead: id },
      orderBy: { data_lembrete: 'asc' },
    });
    return res.json(lembretes.map((l) => ({
      id:          l.id_lembrete,
      leadId:      l.id_lead,
      userId:      l.id_usuario,
      titulo:      l.titulo,
      descricao:   l.descricao ?? '',
      dataLembrete: l.data_lembrete.toISOString(),
      concluido:   l.concluido,
      createdAt:   l.data_criacao.toISOString(),
    })));
  }

  // GET /lembretes/hoje  — para notificação no header
  async hoje(req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.user;
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fim    = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const lembretes = await prisma.lembrete.findMany({
      where: {
        id_usuario:    userId,
        concluido:     false,
        data_lembrete: { gte: inicio, lt: fim },
      },
      include: { lead: { include: { cliente: { select: { nome_cliente: true } } } } },
      orderBy: { data_lembrete: 'asc' },
    });

    return res.json(lembretes.map((l) => ({
      id:          l.id_lembrete,
      titulo:      l.titulo,
      leadId:      l.id_lead,
      clienteName: l.lead.cliente.nome_cliente,
      dataLembrete: l.data_lembrete.toISOString(),
    })));
  }

  // POST /leads/:id/lembretes
  async create(req: Request, res: Response): Promise<Response> {
    const { id: leadId } = req.params;
    const { id: userId } = req.user;
    const { titulo, descricao, dataLembrete } = req.body;

    if (!titulo?.trim() || !dataLembrete) {
      return res.status(400).json({ error: 'Título e data são obrigatórios.' });
    }

    const lembrete = await prisma.lembrete.create({
      data: {
        id_lead:       leadId,
        id_usuario:    userId,
        titulo:        titulo.trim(),
        descricao:     descricao?.trim() ?? null,
        data_lembrete: new Date(dataLembrete),
      },
    });

    return res.status(201).json({
      id:          lembrete.id_lembrete,
      titulo:      lembrete.titulo,
      descricao:   lembrete.descricao ?? '',
      dataLembrete: lembrete.data_lembrete.toISOString(),
      concluido:   lembrete.concluido,
    });
  }

  // PATCH /lembretes/:id/concluir
  async concluir(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updated = await prisma.lembrete.update({
      where: { id_lembrete: id },
      data:  { concluido: true },
    });
    return res.json({ id: updated.id_lembrete, concluido: updated.concluido });
  }

  // DELETE /lembretes/:id
  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await prisma.lembrete.delete({ where: { id_lembrete: id } });
    return res.status(204).send();
  }
}
