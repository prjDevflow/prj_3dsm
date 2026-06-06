import { Request, Response } from 'express';
import { ListOrigensService } from '../services/ListOrigensService';

export class ListOrigensController {
  async handle(_req: Request, res: Response) {
    const listOrigensService = new ListOrigensService();
    const origens = await listOrigensService.execute();

    return res.json(origens);
  }
}
