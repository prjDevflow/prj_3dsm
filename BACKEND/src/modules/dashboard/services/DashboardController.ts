import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  async handle(request: Request, response: Response): Promise<Response> {
    // Recolha de filtros da query string (Data ISO)
    const inicio = request.query.inicio as string;
    const fim = request.query.fim as string;

    // Recolha segura dos dados do utilizador logado via JWT
    const { id: userId, role, equipeId } = request.user;

    const dashboardService = new DashboardService();

    const metricas = await dashboardService.execute({
      role,
      userId,
      equipeId,
      inicio,
      fim
    });

    return response.status(200).json(metricas);
  }
}