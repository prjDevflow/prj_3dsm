"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const DashboardController_1 = require("../../../controllers/DashboardController");
const ensureAuthenticated_1 = require("../../../../../shared/infra/http/middlewares/ensureAuthenticated");
const ensureRole_1 = require("../../../../../shared/infra/http/middlewares/ensureRole");
const UserRole_1 = require("../../../../../domain/models/UserRole");
const dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes = dashboardRoutes;
const dashboardController = new DashboardController_1.DashboardController();
// Exige autenticação
dashboardRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// 🔒 REGRA DE OURO (RF02): Apenas Gerente, Gerente Geral e Admin têm acesso a Dashboards.
// O Atendente recebe erro 403 Forbidden automaticamente.
dashboardRoutes.get('/', (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN, UserRole_1.UserRole.GERENTE_GERAL, UserRole_1.UserRole.GERENTE]), dashboardController.handle);
