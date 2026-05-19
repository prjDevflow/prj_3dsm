import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteClienteController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({ where: { id_cliente: id } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const leadsVinculados = await prisma.lead.count({ where: { id_cliente: id } });
    if (leadsVinculados > 0) {
      return res.status(409).json({ error: 'Não é possível excluir: cliente possui leads vinculados.' });
    }

    await prisma.cliente.delete({ where: { id_cliente: id } });

    return res.status(204).send();
  }
}
