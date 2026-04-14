import { Request, Response } from 'express';
import { ListLogsService } from '../services/ListLogsService';

export class ListLogsController {
  async handle(req: Request, res: Response): Promise<Response> {
    // O role é injetado no req.user pelo middleware ensureAuthenticated
    const { role } = req.user;

    const listLogsService = new ListLogsService();

    try {
      const logs = await listLogsService.execute({ role });
      return res.json(logs);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
    }
  }
}