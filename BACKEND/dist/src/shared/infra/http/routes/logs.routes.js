"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsRoutes = void 0;
const express_1 = require("express");
const ListLogsController_1 = require("../../../../modules/logs/controllers/ListLogsController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const ensureRole_1 = require("../middlewares/ensureRole");
const UserRole_1 = require("../../../../domain/models/UserRole");
const logsRoutes = (0, express_1.Router)();
exports.logsRoutes = logsRoutes;
const listLogsController = new ListLogsController_1.ListLogsController();
// Apenas ADMIN pode sequer chegar perto desta rota (RF02 + RF07)
logsRoutes.get('/', ensureAuthenticated_1.ensureAuthenticated, (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]), listLogsController.handle);
