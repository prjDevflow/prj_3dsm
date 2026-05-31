import { Request, Response } from 'express';
import { ListLogsService } from '../services/ListLogsService';

export class ListLogsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const page  = Math.max(1, parseInt((request.query.page as string) ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((request.query.limit as string) ?? '50', 10)));

    const listLogsService = new ListLogsService();
    const allLogs = await listLogsService.execute();

    const total      = allLogs.length;
    const totalPages = Math.ceil(total / limit);
    const paged      = allLogs.slice((page - 1) * limit, page * limit);

    const data = paged.map((log: any) => ({
      id:         log.id_log,
      userId:     log.id_usuario,
      userName:   log.usuario?.nome_usuario ?? '',
      userEmail:  log.usuario?.email_usuario ?? '',
      action:     log.acao_log?.toLowerCase() ?? 'create',
      entityType: log.tabela_afetada_log?.toLowerCase() ?? '',
      entityId:   log.id_registro_afetado ?? undefined,
      details:    log.detalhes_log ?? log.acao_log ?? '',
      ipAddress:  '',
      userAgent:  '',
      createdAt:  log.data_hora_log?.toISOString() ?? new Date().toISOString(),
    }));

    return response.status(200).json({ data, total, page, limit, totalPages });
  }
}