"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const CreateClienteController_1 = require("../../../../modules/clientes/controllers/CreateClienteController");
const CreateLojaController_1 = require("../../../../modules/lojas/controllers/CreateLojaController");
const CreateOrigemController_1 = require("../../../../modules/origens/controllers/CreateOrigemController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const ensureRole_1 = require("../middlewares/ensureRole");
const UserRole_1 = require("../../../../domain/models/UserRole"); // <-- CORREÇÃO: Importamos o Enum
const leads_routes_1 = require("./leads.routes");
const logs_routes_1 = require("./logs.routes");
const DashboardController_1 = require("../../../../modules/dashboard/controllers/DashboardController");
const auth_routes_1 = require("../../../../modules/auth/infra/http/routes/auth.routes");
const equipes_routes_1 = require("../../../../modules/equipes/infra/http/routes/equipes.routes");
const router = (0, express_1.Router)();
exports.router = router;
// Instanciar Controllers
const createClienteController = new CreateClienteController_1.CreateClienteController();
const createLojaController = new CreateLojaController_1.CreateLojaController();
const createOrigemController = new CreateOrigemController_1.CreateOrigemController();
const dashboardController = new DashboardController_1.DashboardController();
// Rotas de Clientes (Qualquer funcionário autenticado pode criar um cliente)
router.post('/clientes', ensureAuthenticated_1.ensureAuthenticated, createClienteController.handle);
router.use("/sessions", auth_routes_1.authRoutes);
router.use('/equipes', equipes_routes_1.equipesRoutes);
router.post('/lojas', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), createLojaController.handle);
router.post('/origens', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), createOrigemController.handle);
router.use('/leads', leads_routes_1.leadsRoutes);
router.use('/logs', logs_routes_1.logsRoutes);
router.get('/dashboard', ensureAuthenticated_1.ensureAuthenticated, dashboardController.handle);
