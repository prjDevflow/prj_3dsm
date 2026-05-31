import { Request, Response } from 'express';
import { ListLogsService } from '../services/ListLogsService';

export class ListLogsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const page       = Math.max(1, parseInt((request.query.page as string) ?? '1', 10));
    const limit      = Math.min(100, Math.max(1, parseInt((request.query.limit as string) ?? '50', 10)));
    const search     = (request.query.search     as string | undefined)?.toLowerCase().trim();
    const action     = (request.query.action     as string | undefined)?.toLowerCase();
    const entityType = (request.query.entityType as string | undefined)?.toLowerCase();
    const startDate  = request.query.startDate   as string | undefined;
    const endDate    = request.query.endDate     as string | undefined;

    const listLogsService = new ListLogsService();
    const allLogs = await listLogsService.execute();

    const mapped = allLogs.map((log: any) => ({
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

    const filtered = mapped.filter((log) => {
      if (search     && !log.userName.toLowerCase().includes(search)) return false;
      if (action     && log.action !== action)                         return false;
      if (entityType && log.entityType !== entityType)                 return false;
      if (startDate  && new Date(log.createdAt) < new Date(startDate)) return false;
      if (endDate    && new Date(log.createdAt) > new Date(endDate))   return false;
      return true;
    });

    const total      = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paged      = filtered.slice((page - 1) * limit, page * limit);

    return response.status(200).json({ data: paged, total, page, limit, totalPages });
  }
}