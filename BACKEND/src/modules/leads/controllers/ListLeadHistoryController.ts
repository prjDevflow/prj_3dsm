import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListLeadHistoryController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const historicos = await prisma.historicoNegociacao.findMany({
      where: { negociacao: { id_lead: id } },
      include: {
        usuario: { select: { nome_usuario: true } },
        negociacao: { select: { id_negociacao: true } },
      },
      orderBy: { data_alteracao_historico: 'desc' },
    });

    const mapped = historicos.map((h) => ({
      id:          h.id_historico,
      description: h.detalhe_alteracao_historico,
      userName:    h.usuario?.nome_usuario ?? 'Sistema',
      createdAt:   h.data_alteracao_historico.toISOString(),
    }));

    return res.json(mapped);
  }
}
