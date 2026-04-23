import { Router } from 'express';
import { DashboardController } from '../../../controllers/DashboardController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

// Exige autenticação
dashboardRoutes.use(ensureAuthenticated);

// 🔒 REGRA DE OURO (RF02): Apenas Gerente, Gerente Geral e Admin têm acesso a Dashboards.
// O Atendente recebe erro 403 Forbidden automaticamente.
dashboardRoutes.get(
  '/',
  ensureRole([UserRole.ADMIN, UserRole.GERENTE_GERAL, UserRole.GERENTE]),
  dashboardController.handle
);

export { dashboardRoutes };