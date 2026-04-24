"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = void 0;
const express_1 = require("express");
// Controladores de Leads
const CreateLeadController_1 = require("../../../controllers/CreateLeadController");
const ListLeadsController_1 = require("../../../controllers/ListLeadsController");
const UpdateLeadController_1 = require("../../../controllers/UpdateLeadController");
// Controladores de Negociações (RF03) - Aninhados na rota de Leads
const CreateNegotiationController_1 = require("../../../controllers/CreateNegotiationController");
const UpdateNegotiationController_1 = require("../../../controllers/UpdateNegotiationController");
// Middlewares de Segurança (RF01 e RF02)
const ensureAuthenticated_1 = require("../../../../../shared/infra/http/middlewares/ensureAuthenticated");
const ensureRole_1 = require("../../../../../shared/infra/http/middlewares/ensureRole");
const UserRole_1 = require("../../../../../domain/models/UserRole");
const leadsRoutes = (0, express_1.Router)();
exports.leadsRoutes = leadsRoutes;
// Instâncias
const createLeadController = new CreateLeadController_1.CreateLeadController();
const listLeadsController = new ListLeadsController_1.ListLeadsController();
const updateLeadController = new UpdateLeadController_1.UpdateLeadController();
const createNegotiationController = new CreateNegotiationController_1.CreateNegotiationController();
const updateNegotiationController = new UpdateNegotiationController_1.UpdateNegotiationController();
// 🔒 Todas as rotas de leads exigem autenticação válida (Token JWT)
leadsRoutes.use(ensureAuthenticated_1.ensureAuthenticated);
// ==========================================
// 📌 ROTAS PRINCIPAIS DE LEADS
// ==========================================
// Criar um Lead
leadsRoutes.post('/', createLeadController.handle);
// Listar Leads (A filtragem de quem vê o quê ocorre no ListLeadsService via permissão do token)
leadsRoutes.get('/', listLeadsController.handle);
// Atualizar um Lead (RF02 - Regra Granular)
// Bloqueamos expressamente o GERENTE_GERAL. Os restantes são filtrados pelo pertencimento no UpdateLeadService.
leadsRoutes.put('/:id', (0, ensureRole_1.ensureRole)([UserRole_1.UserRole.ADMIN, UserRole_1.UserRole.GERENTE, UserRole_1.UserRole.ATENDENTE]), updateLeadController.handle);
// ==========================================
// 📌 ROTAS DE NEGOCIAÇÕES (Sub-recursos)
// ==========================================
// Abrir Negociação (RF03 - O Lead só pode ter UMA negociação ativa)
leadsRoutes.post('/negotiations', createNegotiationController.handle);
// Atualizar Negociação (RF03 - Altera status, estagio e regista o histórico)
leadsRoutes.put('/negotiations/:id', updateNegotiationController.handle);
