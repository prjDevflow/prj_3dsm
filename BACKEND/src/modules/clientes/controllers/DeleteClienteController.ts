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

    // Cascade delete: históricos → negociações → leads → cliente
    const leads = await prisma.lead.findMany({
      where: { id_cliente: id },
      select: { id_lead: true },
    });
    const leadIds = leads.map(l => l.id_lead);

    if (leadIds.length > 0) {
      const negociacoes = await prisma.negociacao.findMany({
        where: { id_lead: { in: leadIds } },
        select: { id_negociacao: true },
      });
      const negIds = negociacoes.map(n => n.id_negociacao);

      if (negIds.length > 0) {
        await prisma.historicoNegociacao.deleteMany({ where: { id_negociacao: { in: negIds } } });
        await prisma.negociacao.deleteMany({ where: { id_negociacao: { in: negIds } } });
      }

      await prisma.lead.deleteMany({ where: { id_lead: { in: leadIds } } });
    }

    await prisma.cliente.delete({ where: { id_cliente: id } });

    return res.status(204).send();
  }
}
