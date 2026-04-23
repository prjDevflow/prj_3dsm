import { Request, Response } from 'express';
import { ListLogsService } from '../services/ListLogsService';

export class ListLogsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listLogsService = new ListLogsService();
    const logs = await listLogsService.execute();

    return response.status(200).json(logs);
  }
}