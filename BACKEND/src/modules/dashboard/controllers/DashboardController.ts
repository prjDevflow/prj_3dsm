import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { inicio, fim } = req.query;
    const { role, id: userId } = req.user; // Pega o ID do utilizador logado

    const dashboardService = new DashboardService();

    try {
      const metrics = await dashboardService.execute({
        inicio: inicio as string,
        fim: fim as string,
        role,
        userId // <-- Agora passa o userId sem erro de tipagem
      });

      return res.json(metrics);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}