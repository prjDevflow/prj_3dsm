import { Router } from 'express';
import { CreateClienteController } from '../../../../modules/clientes/controllers/CreateClienteController';
import { ListClientesController } from '../../../../modules/clientes/controllers/ListClientesController';
import { CreateLojaController } from '../../../../modules/lojas/controllers/CreateLojaController';
import { CreateOrigemController } from '../../../../modules/origens/controllers/CreateOrigemController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { UserRole } from '../../../../domain/models/UserRole';
import { leadsRoutes } from '../../../../modules/leads/infra/http/routes/leads.routes';
import { logsRoutes } from './logs.routes';
import { DashboardController } from '../../../../modules/dashboard/controllers/DashboardController';
import { authRoutes } from '../../../../modules/auth/infra/http/routes/auth.routes';
import { equipesRoutes } from '../../../../modules/equipes/infra/http/routes/equipes.routes';
import { usersRoutes } from '../../../../modules/users/infra/http/routes/users.routes';
import { CreateUserController } from '../../../../modules/users/controllers/CreateUserController';

const router = Router();

const createClienteController = new CreateClienteController();
const listClientesController  = new ListClientesController();
const createLojaController    = new CreateLojaController();
const createOrigemController  = new CreateOrigemController();
const dashboardController     = new DashboardController();
const createUserController    = new CreateUserController();

// Auth
router.use('/sessions', authRoutes);

// Leads (usando o arquivo completo do módulo com todos os endpoints)
router.use('/leads', leadsRoutes);

// Logs
router.use('/logs', logsRoutes);

// Dashboard — exposto em /dashboard e /dashboard/metrics (alias para o frontend)
router.get('/dashboard',         ensureAuthenticated, dashboardController.handle);
router.get('/dashboard/metrics', ensureAuthenticated, dashboardController.handle);

// Equipes — exposto em /equipes e /teams (alias para o frontend)
router.use('/equipes', equipesRoutes);
router.use('/teams',   equipesRoutes);

// Usuários
router.post('/users',  ensureAuthenticated, ensureRole([UserRole.ADMIN]), createUserController.handle);
router.use('/users',   usersRoutes);

// Clientes — exposto em /clientes e /clients (alias para o frontend)
router.get('/clientes',  ensureAuthenticated, listClientesController.handle);
router.post('/clientes', ensureAuthenticated, createClienteController.handle);
router.get('/clients',   ensureAuthenticated, listClientesController.handle);
router.post('/clients',  ensureAuthenticated, createClienteController.handle);

// Lojas e Origens
router.post('/lojas',   ensureAuthenticated, ensureRole([UserRole.ADMIN]), createLojaController.handle);
router.post('/origens', ensureAuthenticated, ensureRole([UserRole.ADMIN]), createOrigemController.handle);

export { router };