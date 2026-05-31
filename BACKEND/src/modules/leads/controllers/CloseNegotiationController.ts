import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

const prisma = new PrismaClient();

export class CloseNegotiationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const neg = await prisma.negociacao.findUnique({
      where: { id_negociacao: id },
      include: { lead: { include: { cliente: { select: { nome_cliente: true } } } } },
    });

    if (!neg) {
      return res.status(404).json({ error: 'Negociação não encontrada.' });
    }

    if (!neg.estado_abertura_negociacao) {
      return res.status(400).json({ error: 'Negociação já está encerrada.' });
    }

    const { finalStatus } = req.body; // "GANHA" | "PERDIDA"

    let newStatusId: string | undefined;
    if (finalStatus) {
      const sr = await prisma.status.findFirst({
        where: { nome_status: { equals: finalStatus, mode: 'insensitive' } },
      });
      if (sr) newStatusId = sr.id_status;
    }

    const updated = await prisma.negociacao.update({
      where: { id_negociacao: id },
      data: {
        estado_abertura_negociacao:    false,
        motivo_finalizacao_negociacao: reason ?? null,
        ...(newStatusId ? { id_status: newStatusId } : {}),
      },
    });

    const nomeCliente = (neg as any)?.lead?.cliente?.nome_cliente ?? '—';
    const statusLabel = finalStatus ?? 'encerrada';
    const motivoLabel = reason ? ` — motivo: ${reason}` : '';

    await new CreateLogService().execute({
      acao: LogAction.UPDATE,
      entidade: 'NEGOCIACAO',
      entidadeId: id,
      usuarioResponsavelId: userId,
      detalhes: `Negociação de '${nomeCliente}' encerrada como ${statusLabel}${motivoLabel}`,
    });

    return res.json({
      id:           updated.id_negociacao,
      status:       'encerrada',
      closedReason: updated.motivo_finalizacao_negociacao ?? undefined,
    });
  }
}
