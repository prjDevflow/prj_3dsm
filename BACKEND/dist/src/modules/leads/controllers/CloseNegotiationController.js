"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseNegotiationController = void 0;
const client_1 = require("@prisma/client");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
const prisma = new client_1.PrismaClient();
class CloseNegotiationController {
    async handle(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const neg = await prisma.negociacao.findUnique({ where: { id_negociacao: id } });
        if (!neg) {
            return res.status(404).json({ error: 'Negociação não encontrada.' });
        }
        if (!neg.estado_abertura_negociacao) {
            return res.status(400).json({ error: 'Negociação já está encerrada.' });
        }
        const updated = await prisma.negociacao.update({
            where: { id_negociacao: id },
            data: {
                estado_abertura_negociacao: false,
                motivo_finalizacao_negociacao: reason ?? null,
            },
        });
        await new CreateLogService_1.CreateLogService().execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'NEGOCIACAO',
            entidadeId: id,
            usuarioResponsavelId: userId,
        });
        return res.json({
            id: updated.id_negociacao,
            status: 'encerrada',
            closedReason: updated.motivo_finalizacao_negociacao ?? undefined,
        });
    }
}
exports.CloseNegotiationController = CloseNegotiationController;
