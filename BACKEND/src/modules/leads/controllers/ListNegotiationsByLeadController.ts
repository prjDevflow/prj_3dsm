import { Request, Response } from 'express';
import { prisma } from '../../../shared/infra/prisma/client';


export class ListNegotiationsByLeadController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const negociacoes = await prisma.negociacao.findMany({
      where: { id_lead: id },
      include: {
        status:  true,
        estagio: true,
      },
      orderBy: { data_criacao_negociacao: 'desc' },
    });

    const mapped = negociacoes.map((neg) => {
      const statusNome  = neg.status?.nome_status?.toLowerCase()  ?? 'novo';
      const estagioNome = neg.estagio?.nome_estagio?.toLowerCase() ?? 'primeiro_contato';
      const imp         = neg.importancia_negociacao?.toLowerCase() ?? 'frio';

      return {
        id:           neg.id_negociacao,
        leadId:       neg.id_lead,
        userId:       null,
        content:      neg.observacao_negociacao ?? '',
        type:         'comentário' as const,
        importance:   imp === 'quente' ? 'quente' : imp === 'morno' ? 'morno' : 'frio',
        stage:        estagioNome.replace(/ /g, '_'),
        status:       neg.estado_abertura_negociacao ? 'ativa' : 'encerrada',
        statusId:     neg.id_status,
        estagioId:    neg.id_estagio,
        closedReason: neg.motivo_finalizacao_negociacao ?? undefined,
        createdAt:    neg.data_criacao_negociacao.toISOString(),
      };
    });

    return res.json(mapped);
  }
}
