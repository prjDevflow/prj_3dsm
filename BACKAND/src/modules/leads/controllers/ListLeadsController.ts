import { Request, Response } from 'express';
import { ListLeadsService } from '../services/ListLeadsService';

export class ListLeadsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: userId, role } = req.user; // Captura do middleware
    const { startDate, equipeId } = req.query; // Filtros opcionais da URL

    const listLeadsService = new ListLeadsService();

    try {
      const leads = await listLeadsService.execute({
        userId,
        role,
        equipeId: equipeId as string,
        startDate: startDate ? new Date(startDate as string) : undefined
      });

      return res.json(leads);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}