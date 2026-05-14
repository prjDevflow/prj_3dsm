"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const DashboardService_1 = require("../services/DashboardService");
class DashboardController {
    async handle(req, res) {
        // aceita tanto inicio/fim (padrão interno) quanto startDate/endDate (frontend)
        const inicio = (req.query.inicio ?? req.query.startDate);
        const fim = (req.query.fim ?? req.query.endDate);
        const { role, id: userId } = req.user;
        const dashboardService = new DashboardService_1.DashboardService();
        try {
            const metrics = await dashboardService.execute({
                inicio: inicio,
                fim: fim,
                role,
                userId // <-- Agora passa o userId sem erro de tipagem
            });
            return res.json(metrics);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.DashboardController = DashboardController;
