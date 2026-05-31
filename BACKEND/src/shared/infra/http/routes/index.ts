import { Router } from 'express';
import { CreateClienteController } from '../../../../modules/clientes/controllers/CreateClienteController';
import { ListClientesController } from '../../../../modules/clientes/controllers/ListClientesController';
import { UpdateClienteController } from '../../../../modules/clientes/controllers/UpdateClienteController';
import { DeleteClienteController } from '../../../../modules/clientes/controllers/DeleteClienteController';
import { ListConsultoresController } from '../../../../modules/clientes/controllers/ListConsultoresController';
import { CreateLojaController } from '../../../../modules/lojas/controllers/CreateLojaController';
import { ListLojasController } from '../../../../modules/lojas/controllers/ListLojasController';
import { DeleteLojaController } from '../../../../modules/lojas/controllers/DeleteLojaController';
import { CreateOrigemController } from '../../../../modules/origens/controllers/CreateOrigemController';
import { ListOrigensController } from '../../../../modules/origens/controllers/ListOrigensController';
import { DeleteOrigemController } from '../../../../modules/origens/controllers/DeleteOrigemController';
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
import { PapeisController } from '../../../../modules/papeis/PapeisController';

const router = Router();

const createClienteController = new CreateClienteController();
const listClientesController  = new ListClientesController();
const updateClienteController    = new UpdateClienteController();
const deleteClienteController    = new DeleteClienteController();
const listConsultoresController  = new ListConsultoresController();
const createLojaController    = new CreateLojaController();
const listLojasController     = new ListLojasController();
const deleteLojaController    = new DeleteLojaController();
const createOrigemController  = new CreateOrigemController();
const listOrigensController   = new ListOrigensController();
const deleteOrigemController  = new DeleteOrigemController();
const dashboardController     = new DashboardController();
const createUserController    = new CreateUserController();
const papeisController        = new PapeisController();

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

// Consultores (lista de usuários para o select de clientes — acessível a todos)
router.get('/consultores', ensureAuthenticated, listConsultoresController.handle);

// Clientes — exposto em /clientes e /clients (alias para o frontend)
router.get('/clientes',         ensureAuthenticated, listClientesController.handle);
router.post('/clientes',        ensureAuthenticated, createClienteController.handle);
router.put('/clientes/:id',     ensureAuthenticated, updateClienteController.handle);
router.delete('/clientes/:id',  ensureAuthenticated, deleteClienteController.handle);
router.get('/clients',          ensureAuthenticated, listClientesController.handle);
router.post('/clients',         ensureAuthenticated, createClienteController.handle);
router.put('/clients/:id',      ensureAuthenticated, updateClienteController.handle);
router.delete('/clients/:id',   ensureAuthenticated, deleteClienteController.handle);

// Lojas e Origens
router.get('/lojas',          ensureAuthenticated, listLojasController.handle);
router.post('/lojas',         ensureAuthenticated, ensureRole([UserRole.ADMIN]), createLojaController.handle);
router.delete('/lojas/:id',   ensureAuthenticated, ensureRole([UserRole.ADMIN]), deleteLojaController.handle);
router.get('/origens',        ensureAuthenticated, listOrigensController.handle);
router.post('/origens',       ensureAuthenticated, ensureRole([UserRole.ADMIN]), createOrigemController.handle);
router.delete('/origens/:id', ensureAuthenticated, ensureRole([UserRole.ADMIN]), deleteOrigemController.handle);

// Papeis & capabilities
router.get('/papeis',                  ensureAuthenticated, (req, res) => papeisController.list(req, res));
router.post('/papeis',                 ensureAuthenticated, ensureRole([UserRole.ADMIN]), (req, res) => papeisController.create(req, res));
router.put('/papeis/:id',              ensureAuthenticated, ensureRole([UserRole.ADMIN]), (req, res) => papeisController.update(req, res));
router.delete('/papeis/:id',           ensureAuthenticated, ensureRole([UserRole.ADMIN]), (req, res) => papeisController.remove(req, res));
router.get('/papeis/user/:id',         ensureAuthenticated, (req, res) => papeisController.userCapabilities(req, res));
router.put('/papeis/user/:id/extras',  ensureAuthenticated, ensureRole([UserRole.ADMIN]), (req, res) => papeisController.updateUserExtras(req, res));

export { router };