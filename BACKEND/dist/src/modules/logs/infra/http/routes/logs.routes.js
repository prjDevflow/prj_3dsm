"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsRoutes = void 0;
const express_1 = require("express");
const ListLogsController_1 = require("../../../controllers/ListLogsController");
const ensureAuthenticated_1 = require("../../../../../shared/infra/http/middlewares/ensureAuthenticated");
const ensureRole_1 = require("../../../../../shared/infra/http/middlewares/ensureRole");
const UserRole_1 = require("../../../../../domain/models/UserRole");
const logsRoutes = (0, express_1.Router)();
exports.logsRoutes = logsRoutes;
const listLogsController = new ListLogsController_1.ListLogsController();
// 🔒 Exige que o utilizador esteja autenticado
logsRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// 🔒 REGRA DE OURO (RF02 e RF07): Apenas Administradores podem aceder à auditoria
logsRoutes.get('/', (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), listLogsController.handle);
