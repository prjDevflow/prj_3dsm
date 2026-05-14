"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const CreateClienteController_1 = require("../../../../modules/clientes/controllers/CreateClienteController");
const ListClientesController_1 = require("../../../../modules/clientes/controllers/ListClientesController");
const CreateLojaController_1 = require("../../../../modules/lojas/controllers/CreateLojaController");
const CreateOrigemController_1 = require("../../../../modules/origens/controllers/CreateOrigemController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const ensureRole_1 = require("../middlewares/ensureRole");
const UserRole_1 = require("../../../../domain/models/UserRole");
const leads_routes_1 = require("../../../../modules/leads/infra/http/routes/leads.routes");
const logs_routes_1 = require("./logs.routes");
const DashboardController_1 = require("../../../../modules/dashboard/controllers/DashboardController");
const auth_routes_1 = require("../../../../modules/auth/infra/http/routes/auth.routes");
const equipes_routes_1 = require("../../../../modules/equipes/infra/http/routes/equipes.routes");
const users_routes_1 = require("../../../../modules/users/infra/http/routes/users.routes");
const CreateUserController_1 = require("../../../../modules/users/controllers/CreateUserController");
const router = (0, express_1.Router)();
exports.router = router;
const createClienteController = new CreateClienteController_1.CreateClienteController();
const listClientesController = new ListClientesController_1.ListClientesController();
const createLojaController = new CreateLojaController_1.CreateLojaController();
const createOrigemController = new CreateOrigemController_1.CreateOrigemController();
const dashboardController = new DashboardController_1.DashboardController();
const createUserController = new CreateUserController_1.CreateUserController();
// Auth
router.use('/sessions', auth_routes_1.authRoutes);
// Leads (usando o arquivo completo do módulo com todos os endpoints)
router.use('/leads', leads_routes_1.leadsRoutes);
// Logs
router.use('/logs', logs_routes_1.logsRoutes);
// Dashboard — exposto em /dashboard e /dashboard/metrics (alias para o frontend)
router.get('/dashboard', ensureAuthenticated_1.ensureAuthenticated, dashboardController.handle);
router.get('/dashboard/metrics', ensureAuthenticated_1.ensureAuthenticated, dashboardController.handle);
// Equipes — exposto em /equipes e /teams (alias para o frontend)
router.use('/equipes', equipes_routes_1.equipesRoutes);
router.use('/teams', equipes_routes_1.equipesRoutes);
// Usuários
router.post('/users', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), createUserController.handle);
router.use('/users', users_routes_1.usersRoutes);
// Clientes — exposto em /clientes e /clients (alias para o frontend)
router.get('/clientes', ensureAuthenticated_1.ensureAuthenticated, listClientesController.handle);
router.post('/clientes', ensureAuthenticated_1.ensureAuthenticated, createClienteController.handle);
router.get('/clients', ensureAuthenticated_1.ensureAuthenticated, listClientesController.handle);
router.post('/clients', ensureAuthenticated_1.ensureAuthenticated, createClienteController.handle);
// Lojas e Origens
router.post('/lojas', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), createLojaController.handle);
router.post('/origens', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), createOrigemController.handle);
