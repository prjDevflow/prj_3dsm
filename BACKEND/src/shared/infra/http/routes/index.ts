import { Router } from 'express';
import { CreateClienteController } from '../../../../modules/clientes/controllers/CreateClienteController';
import { CreateLojaController } from '../../../../modules/lojas/controllers/CreateLojaController';
import { CreateOrigemController } from '../../../../modules/origens/controllers/CreateOrigemController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { UserRole } from '../../../../domain/models/UserRole'; // <-- CORREÇÃO: Importamos o Enum
import { leadsRoutes } from './leads.routes';
import { logsRoutes } from './logs.routes';
import { DashboardController } from '../../../../modules/dashboard/controllers/DashboardController';
import { authRoutes } from "../../../../modules/auth/infra/http/routes/auth.routes";
import { equipesRoutes } from '../../../../modules/equipes/infra/http/routes/equipes.routes';

const router = Router();

// Instanciar Controllers
const createClienteController = new CreateClienteController();
const createLojaController = new CreateLojaController();
const createOrigemController = new CreateOrigemController();
const dashboardController = new DashboardController();
// Rotas de Clientes (Qualquer funcionário autenticado pode criar um cliente)
router.post('/clientes', ensureAuthenticated, createClienteController.handle);
router.use("/sessions", authRoutes);
router.use('/equipes', equipesRoutes);
router.post('/lojas', ensureAuthenticated, ensureRole([UserRole.ADMIN]), createLojaController.handle);
router.post('/origens', ensureAuthenticated, ensureRole([UserRole.ADMIN]), createOrigemController.handle);
router.use('/leads', leadsRoutes);
router.use('/logs', logsRoutes);
router.get('/dashboard', ensureAuthenticated, dashboardController.handle);
// ... (se possuir outras rotas de leads, auth, etc., mantenha-as aqui abaixo)

export { router };