import { Request, Response } from 'express';
import { ListConsultoresService } from '../services/ListConsultoresService';

export class ListConsultoresController {
  async handle(_req: Request, res: Response) {
    const listConsultoresService = new ListConsultoresService();
    const consultores = await listConsultoresService.execute();

    return res.json(consultores);
  }
}
