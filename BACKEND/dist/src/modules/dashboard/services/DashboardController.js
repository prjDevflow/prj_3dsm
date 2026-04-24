"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const DashboardService_1 = require("../services/DashboardService");
class DashboardController {
    async handle(request, response) {
        // Recolha de filtros da query string (Data ISO)
        const inicio = request.query.inicio;
        const fim = request.query.fim;
        // Recolha segura dos dados do utilizador logado via JWT
        const { id: userId, role, equipeId } = request.user;
        const dashboardService = new DashboardService_1.DashboardService();
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
exports.DashboardController = DashboardController;
