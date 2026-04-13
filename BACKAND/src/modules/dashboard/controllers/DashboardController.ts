import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { subDays } from 'date-fns';

export class DashboardController {
  async handle(req: Request, res: Response): Promise<Response> {
    // Dados injetados pelo ensureAuthenticated
    const { id: userId, role } = req.user; 

    // Datas que vêm da URL (?startDate=2025-01-01&endDate=2025-12-31)
    let { startDate, endDate } = req.query;

    let parsedStartDate: Date;
    let parsedEndDate: Date;

    // RF04 - Filtro padrão: últimos 30 dias se o usuário não enviar datas
    if (!startDate || !endDate) {
      parsedEndDate = new Date(); // Hoje
      parsedStartDate = subDays(parsedEndDate, 30); // 30 dias para trás
    } else {
      parsedStartDate = new Date(startDate as string);
      parsedEndDate = new Date(endDate as string);
    }

    const dashboardService = new DashboardService();

    try {
      const metrics = await dashboardService.execute({
        userId,
        role,
        startDate: parsedStartDate,
        endDate: parsedEndDate
      });

      return res.json(metrics);
    } catch (err: any) {
      // Se for um erro do RF02 ou RF06 contendo a palavra "Acesso negado", retorna 403 Forbidden
      const statusCode = err.message.includes("Acesso negado") ? 403 : 400;
      return res.status(statusCode).json({ error: err.message });
    }
  }
}