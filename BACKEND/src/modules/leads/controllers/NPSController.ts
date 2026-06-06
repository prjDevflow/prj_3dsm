import { Request, Response } from 'express';
import { prisma } from '../../../shared/infra/prisma/client';


export class NPSController {
  // POST /leads/negotiations/:id/nps
  async create(req: Request, res: Response): Promise<Response> {
    const { id: negociacaoId } = req.params;
    const { pontuacao, comentario } = req.body;

    if (pontuacao === undefined || pontuacao < 1 || pontuacao > 10) {
      return res.status(400).json({ error: 'Pontuação deve ser entre 1 e 10.' });
    }

    const neg = await prisma.negociacao.findUnique({ where: { id_negociacao: negociacaoId } });
    if (!neg) return res.status(404).json({ error: 'Negociação não encontrada.' });

    const existing = await prisma.avaliacaoNPS.findUnique({ where: { id_negociacao: negociacaoId } });
    if (existing) return res.status(400).json({ error: 'Esta negociação já foi avaliada.' });

    const avaliacao = await prisma.avaliacaoNPS.create({
      data: {
        id_negociacao: negociacaoId,
        id_lead:       neg.id_lead,
        pontuacao:     Number(pontuacao),
        comentario:    comentario?.trim() ?? null,
      },
    });

    return res.status(201).json({
      id:         avaliacao.id_avaliacao,
      pontuacao:  avaliacao.pontuacao,
      comentario: avaliacao.comentario ?? '',
    });
  }
}
