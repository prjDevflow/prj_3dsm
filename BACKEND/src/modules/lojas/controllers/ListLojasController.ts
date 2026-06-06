import { Request, Response } from 'express';
import { ListLojasService } from '../services/ListLojasService';

export class ListLojasController {
  async handle(_req: Request, res: Response) {
    const listLojasService = new ListLojasService();
    const lojas = await listLojasService.execute();

    return res.json(lojas);
  }
}
