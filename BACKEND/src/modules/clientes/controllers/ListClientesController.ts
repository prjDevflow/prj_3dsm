import { Request, Response } from 'express';
import { ListClientesService } from '../services/ListClientesService';

export class ListClientesController {
  async handle(req: Request, res: Response) {
    const { search, page = '1', limit = '20', assignedTo, hasLead } =
      req.query as Record<string, string>;
    const { id: userId, role } = req.user;

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const listClientesService = new ListClientesService();
    const result = await listClientesService.execute({
      search,
      assignedTo,
      hasLead,
      userId,
      role,
      page: pageNum,
      limit: limitNum,
    });

    return res.json(result);
  }
}
