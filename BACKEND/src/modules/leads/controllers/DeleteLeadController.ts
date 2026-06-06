import { Request, Response } from 'express';
import { prisma } from '../../../shared/infra/prisma/client';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';
import { UserRole } from '../../../domain/models/UserRole';


export class DeleteLeadController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    const lead = await prisma.lead.findUnique({
      where: { id_lead: id },
      include: {
        usuario: { select: { id_usuario: true, id_equipe: true } },
        cliente: { select: { nome_cliente: true } },
      },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado.' });
    }

    // Apenas ADMIN pode deletar qualquer lead; GERENTE e ATENDENTE só os seus
    if (role === UserRole.ATENDENTE && lead.id_usuario !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Remove negociações e históricos antes (integridade referencial)
    await prisma.historicoNegociacao.deleteMany({
      where: { negociacao: { id_lead: id } },
    });
    await prisma.negociacao.deleteMany({ where: { id_lead: id } });
    await prisma.lead.delete({ where: { id_lead: id } });

    const createLogService = new CreateLogService();
    await createLogService.execute({
      acao: LogAction.DELETE,
      entidade: 'LEAD',
      entidadeId: id,
      usuarioResponsavelId: userId,
      detalhes: `Lead de '${lead.cliente?.nome_cliente ?? '—'}' excluído`,
    });

    return res.status(204).send();
  }
}
