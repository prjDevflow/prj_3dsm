import { Router } from 'express';
import { DashboardController } from '../../../controllers/DashboardController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get('/', ensureAuthenticated, dashboardController.handle);

export { dashboardRoutes };