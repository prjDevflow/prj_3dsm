"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLeadController = void 0;
const client_1 = require("@prisma/client");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
const UserRole_1 = require("../../../domain/models/UserRole");
const prisma = new client_1.PrismaClient();
class DeleteLeadController {
    async handle(req, res) {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        const lead = await prisma.lead.findUnique({
            where: { id_lead: id },
            include: { usuario: { select: { id_usuario: true, id_equipe: true } } },
        });
        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado.' });
        }
        // Apenas ADMIN pode deletar qualquer lead; GERENTE e ATENDENTE só os seus
        if (role === UserRole_1.UserRole.ATENDENTE && lead.id_usuario !== userId) {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        // Remove negociações e históricos antes (integridade referencial)
        await prisma.historicoNegociacao.deleteMany({
            where: { negociacao: { id_lead: id } },
        });
        await prisma.negociacao.deleteMany({ where: { id_lead: id } });
        await prisma.lead.delete({ where: { id_lead: id } });
        const createLogService = new CreateLogService_1.CreateLogService();
        await createLogService.execute({
            acao: Log_1.LogAction.DELETE,
            entidade: 'LEAD',
            entidadeId: id,
            usuarioResponsavelId: userId,
        });
        return res.status(204).send();
    }
}
exports.DeleteLeadController = DeleteLeadController;
