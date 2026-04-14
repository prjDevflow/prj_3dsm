import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  /**
   * handle: Responsável por capturar os filtros da requisição e 
   * os dados do usuário logado para gerar as métricas (RF04/RF05).
   */
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Captura as datas opcionais vindas da Query String (?inicio=YYYY-MM-DD&fim=...)
      const { inicio, fim } = req.query;

      // 2. Captura os dados do usuário injetados pelo middleware ensureAuthenticated
      // Extraímos o 'id' e renomeamos para 'userId' para alinhar com o Serviço
      const { role, id: userId } = req.user;

      // 3. Instancia o serviço de Dashboard
      const dashboardService = new DashboardService();

      // 4. Executa a lógica passando todos os parâmetros obrigatórios pela interface
      const metrics = await dashboardService.execute({
        inicio: inicio as string | undefined,
        fim: fim as string | undefined,
        role,
        userId // <-- Este era o campo que faltava para sanar o erro TS2345
      });

      // 5. Retorna os dados processados (Total de Leads, Conversão, etc.)
      return res.json(metrics);

    } catch (error: any) {
      // Caso o DateValidator lance um erro (ex: intervalo > 1 ano), 
      // retornamos 400 - Bad Request (RF06)
      return res.status(400).json({ 
        error: error.message || "Erro ao processar as métricas do dashboard." 
      });
    }
  }
}