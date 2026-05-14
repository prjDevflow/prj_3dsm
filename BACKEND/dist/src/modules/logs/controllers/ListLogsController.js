"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsController = void 0;
const ListLogsService_1 = require("../services/ListLogsService");
class ListLogsController {
    async handle(request, response) {
        const page = Math.max(1, parseInt(request.query.page ?? '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit ?? '50', 10)));
        const listLogsService = new ListLogsService_1.ListLogsService();
        const allLogs = await listLogsService.execute();
        const total = allLogs.length;
        const totalPages = Math.ceil(total / limit);
        const paged = allLogs.slice((page - 1) * limit, page * limit);
        const data = paged.map((log) => ({
            id: log.id_log,
            userId: log.id_usuario,
            userName: log.usuario?.nome_usuario ?? '',
            userEmail: log.usuario?.email_usuario ?? '',
            action: log.acao_log?.toLowerCase() ?? 'create',
            entityType: log.tabela_afetada_log?.toLowerCase() ?? '',
            entityId: log.id_registro_afetado ?? undefined,
            details: log.acao_log ?? '',
            ipAddress: '',
            userAgent: '',
            createdAt: log.data_hora_log?.toISOString() ?? new Date().toISOString(),
        }));
        return response.status(200).json({ data, total, page, limit, totalPages });
    }
}
exports.ListLogsController = ListLogsController;
