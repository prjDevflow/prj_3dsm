"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLeadByIdController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function mapLeadToDTO(lead) {
    const activeNeg = lead.negociacoes?.find((n) => n.estado_abertura_negociacao === true);
    const lastNeg = lead.negociacoes?.[0];
    const neg = activeNeg ?? lastNeg;
    const statusFromNeg = (() => {
        if (!neg)
            return 'novo';
        const s = neg.status?.nome_status?.toUpperCase() ?? '';
        if (s === 'GANHO' || s === 'CONVERTIDO')
            return 'ganho';
        if (s === 'PERDIDO' || s === 'CANCELADO')
            return 'perdido';
        const e = neg.estagio?.nome_estagio?.toUpperCase() ?? '';
        if (e === 'PRIMEIRO_CONTATO')
            return 'contatado';
        return 'qualificado';
    })();
    const importanceFromNeg = (() => {
        if (!neg)
            return 'media';
        const i = neg.importancia_negociacao?.toUpperCase() ?? '';
        if (i === 'QUENTE')
            return 'alta';
        if (i === 'FRIO')
            return 'baixa';
        return 'media';
    })();
    return {
        id: lead.id_lead,
        name: lead.cliente?.nome_cliente ?? '',
        email: lead.cliente?.email_cliente ?? '',
        phone: lead.cliente?.telefone_cliente ?? '',
        status: statusFromNeg,
        importance: importanceFromNeg,
        origin: lead.origem?.nome_origem ?? '',
        store: lead.loja?.nome_loja ?? '',
        assignedTo: lead.usuario?.nome_usuario ?? '',
        teamId: lead.usuario?.id_equipe ?? null,
        createdAt: lead.data_criacao_lead?.toISOString() ?? new Date().toISOString(),
        updatedAt: lead.data_criacao_lead?.toISOString() ?? new Date().toISOString(),
    };
}
class GetLeadByIdController {
    async handle(req, res) {
        const { id } = req.params;
        const lead = await prisma.lead.findUnique({
            where: { id_lead: id },
            include: {
                cliente: true,
                usuario: true,
                loja: true,
                origem: true,
                negociacoes: {
                    include: { status: true, estagio: true },
                    orderBy: { data_criacao_negociacao: 'desc' },
                },
            },
        });
        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado.' });
        }
        return res.json(mapLeadToDTO(lead));
    }
}
exports.GetLeadByIdController = GetLeadByIdController;
