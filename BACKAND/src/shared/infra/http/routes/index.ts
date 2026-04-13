import { Router } from 'express';
import { authRoutes } from '../../../../modules/auth/infra/http/routes/auth.routes';
import { leadsRoutes } from './leads.routes';
import { dashboardRoutes } from '../../../../modules/dashboard/infra/http/routes/dashboard.routes';

const routes = Router();

routes.use('/sessions', authRoutes);
routes.use('/leads', leadsRoutes);
routes.use('/dashboard', dashboardRoutes);

export { routes };