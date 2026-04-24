"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipesRoutes = void 0;
const express_1 = require("express");
const EquipesController_1 = require("../../../controllers/EquipesController");
const ensureAuthenticated_1 = require("../../../../../shared/infra/http/middlewares/ensureAuthenticated");
const ensureRole_1 = require("../../../../../shared/infra/http/middlewares/ensureRole");
const UserRole_1 = require("../../../../../domain/models/UserRole");
const equipesRoutes = (0, express_1.Router)();
exports.equipesRoutes = equipesRoutes;
const equipesController = new EquipesController_1.EquipesController();
// Todas as rotas de equipes exigem autenticação
equipesRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// A regra de Ouro do RF02: Apenas ADMIN pode gerenciar equipes [cite: 107, 110, 116]
equipesRoutes.use((0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN]));
equipesRoutes.post('/', equipesController.create);
equipesRoutes.get('/', equipesController.list);
equipesRoutes.put('/:id', equipesController.update);
equipesRoutes.delete('/:id', equipesController.delete);
