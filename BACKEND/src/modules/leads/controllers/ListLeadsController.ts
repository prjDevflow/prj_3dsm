import { Request, Response } from 'express';
import { ListLeadsService } from '../services/ListLeadsService';

function mapLeadToDTO(lead: any) {
  const negociacoes: any[] = lead.negociacoes ?? [];
  const activeNeg = negociacoes.find((n) => n.estado_abertura_negociacao === true);
  const lastNeg   = negociacoes[0];
  const neg       = activeNeg ?? lastNeg;

  const status = (() => {
    if (!neg) return 'novo';
    const s = neg.status?.nome_status?.toUpperCase() ?? '';
    if (s === 'GANHA' || s === 'GANHO' || s === 'CONVERTIDO') return 'ganho';
    if (s === 'PERDIDA' || s === 'PERDIDO' || s === 'CANCELADA' || s === 'CANCELADO') return 'perdido';
    const e = neg.estagio?.nome_estagio?.toUpperCase() ?? '';
    if (e === 'PRIMEIRO_CONTATO') return 'contatado';
    return 'qualificado';
  })();

  const importance = (() => {
    if (!neg) return 'media';
    const i = neg.importancia_negociacao?.toUpperCase() ?? '';
    if (i === 'QUENTE') return 'alta';
    if (i === 'FRIO')   return 'baixa';
    return 'media';
  })();

  return {
    id:         lead.id_lead,
    name:       lead.cliente?.nome_cliente ?? '',
    email:      lead.cliente?.email_cliente ?? '',
    phone:      lead.cliente?.telefone_cliente ?? '',
    status,
    importance,
    origin:     lead.origem?.nome_origem ?? '',
    store:      lead.loja?.nome_loja ?? '',
    assignedTo: lead.usuario?.nome_usuario ?? '',
    teamId:     lead.usuario?.id_equipe ?? null,
    createdAt:  lead.data_criacao_lead?.toISOString() ?? new Date().toISOString(),
    updatedAt:  lead.data_criacao_lead?.toISOString() ?? new Date().toISOString(),
  };
}

export class ListLeadsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: userId, role } = req.user;
    const inicio = (req.query.inicio ?? req.query.startDate) as string | undefined;
    const fim    = (req.query.fim   ?? req.query.endDate)   as string | undefined;
    const store  = req.query.store  as string | undefined;
    const team   = req.query.team   as string | undefined;

    const page   = Math.max(1, parseInt((req.query.page as string) ?? '1', 10));
    const limit  = Math.min(2000, Math.max(1, parseInt((req.query.limit as string) ?? '20', 10)));
    const search = req.query.search as string | undefined;

    const listLeadsService = new ListLeadsService();

    const allLeads = await listLeadsService.execute({ userId, role, inicio, fim, store, team, search });

    const total      = allLeads.length;
    const totalPages = Math.ceil(total / limit);
    const paged      = allLeads.slice((page - 1) * limit, page * limit);

    return res.json({
      data:       paged.map(mapLeadToDTO),
      total,
      page,
      limit,
      totalPages,
    });
  }
}