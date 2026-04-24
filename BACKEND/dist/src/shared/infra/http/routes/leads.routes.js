"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = void 0;
const express_1 = require("express");
const CreateLeadController_1 = require("../../../../modules/leads/controllers/CreateLeadController");
const CreateNegotiationController_1 = require("../../../../modules/leads/controllers/CreateNegotiationController");
const ListLeadsController_1 = require("../../../../modules/leads/controllers/ListLeadsController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const UpdateNegotiationController_1 = require("../../../../modules/leads/controllers/UpdateNegotiationController");
const leadsRoutes = (0, express_1.Router)();
exports.leadsRoutes = leadsRoutes;
const updateNegotiationController = new UpdateNegotiationController_1.UpdateNegotiationController();
const createLeadController = new CreateLeadController_1.CreateLeadController();
const createNegotiationController = new CreateNegotiationController_1.CreateNegotiationController();
const listLeadsController = new ListLeadsController_1.ListLeadsController();
// Todas as rotas de leads exigem que o utilizador esteja autenticado
leadsRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// Rotas de Leads
leadsRoutes.post('/', createLeadController.handle);
leadsRoutes.get('/', listLeadsController.handle);
leadsRoutes.put('/negotiations/:id', ensureAuthenticated_1.ensureAuthenticated, updateNegotiationController.handle);
// Rotas de Negociações
leadsRoutes.post('/negotiations', createNegotiationController.handle);
