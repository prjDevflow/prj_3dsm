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

    // Resolve UUIDs in descriptions to human-readable names
    const [statuses, estagios] = await Promise.all([
      prisma.status.findMany({ select: { id_status: true, nome_status: true } }),
      prisma.estagio.findMany({ select: { id_estagio: true, nome_estagio: true } }),
    ]);
    const statusMap = Object.fromEntries(statuses.map((s) => [s.id_status, s.nome_status]));
    const estagioMap = Object.fromEntries(estagios.map((e) => [e.id_estagio, e.nome_estagio]));

    const uuidRe = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const resolveUuids = (text: string) =>
      text.replace(uuidRe, (id) => statusMap[id] ?? estagioMap[id] ?? id);

    const mapped = historicos.map((h) => ({
      id:          h.id_historico,
      description: resolveUuids(h.detalhe_alteracao_historico),
      userName:    h.usuario?.nome_usuario ?? 'Sistema',
      createdAt:   h.data_alteracao_historico.toISOString(),
    }));

    return res.json(mapped);
  }
}
