"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const UsersManagementController_1 = require("../../../../users/services/UsersManagementController");
const ensureAuthenticated_1 = require("../../../../../shared/infra/http/middlewares/ensureAuthenticated");
const ensureRole_1 = require("../../../../../shared/infra/http/middlewares/ensureRole");
const UserRole_1 = require("../../../../../domain/models/UserRole");
const usersRoutes = (0, express_1.Router)();
exports.usersRoutes = usersRoutes;
const usersManagementController = new UsersManagementController_1.UsersManagementController();
// Verifica Token
usersRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// Regra Ouro RF02: Apenas ADMIN pode gerenciar usuários
usersRoutes.use((0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]));
// O POST '/' já existe no seu auth.routes.ts ou CreateUserService, 
// então aqui focamos no restante do CRUD
usersRoutes.get('/', usersManagementController.list);
usersRoutes.put('/:id', usersManagementController.update);
usersRoutes.delete('/:id', usersManagementController.delete);
