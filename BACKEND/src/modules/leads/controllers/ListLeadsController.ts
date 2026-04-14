import { Request, Response } from 'express';
import { ListLeadsService } from '../services/ListLeadsService';

export class ListLeadsController {
  async handle(req: Request, res: Response): Promise<Response> {
    // Pegamos apenas o que o serviço realmente precisa: id (como userId), role e as datas da query
    const { id: userId, role } = req.user;
    const { inicio, fim } = req.query;

    const listLeadsService = new ListLeadsService();

    // Removemos o 'equipeId' daqui, pois o serviço não o utiliza na interface IListLeadsRequest
    const leads = await listLeadsService.execute({
      userId,
      role,
      inicio: inicio as string,
      fim: fim as string
    });

    return res.json(leads);
  }
}