import { Router } from 'express';

// Controladores de Leads
import { CreateLeadController } from '../../../controllers/CreateLeadController';
import { ListLeadsController } from '../../../controllers/ListLeadsController';
import { UpdateLeadController } from '../../../controllers/UpdateLeadController';

// Controladores de Negociações (RF03) - Aninhados na rota de Leads
import { CreateNegotiationController } from '../../../controllers/CreateNegotiationController';
import { UpdateNegotiationController } from '../../../controllers/UpdateNegotiationController';

// Middlewares de Segurança (RF01 e RF02)
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const leadsRoutes = Router();

// Instâncias
const createLeadController = new CreateLeadController();
const listLeadsController = new ListLeadsController();
const updateLeadController = new UpdateLeadController();
const createNegotiationController = new CreateNegotiationController();
const updateNegotiationController = new UpdateNegotiationController();

// 🔒 Todas as rotas de leads exigem autenticação válida (Token JWT)
leadsRoutes.use(ensureAuthenticated);


// ==========================================
// 📌 ROTAS PRINCIPAIS DE LEADS
// ==========================================

// Criar um Lead
leadsRoutes.post('/', createLeadController.handle);

// Listar Leads (A filtragem de quem vê o quê ocorre no ListLeadsService via permissão do token)
leadsRoutes.get('/', listLeadsController.handle);

// Atualizar um Lead (RF02 - Regra Granular)
// Bloqueamos expressamente o GERENTE_GERAL. Os restantes são filtrados pelo pertencimento no UpdateLeadService.
leadsRoutes.put(
  '/:id',
  ensureRole([UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE]),
  updateLeadController.handle
);


// ==========================================
// 📌 ROTAS DE NEGOCIAÇÕES (Sub-recursos)
// ==========================================

// Abrir Negociação (RF03 - O Lead só pode ter UMA negociação ativa)
leadsRoutes.post('/negotiations', createNegotiationController.handle);

// Atualizar Negociação (RF03 - Altera status, estagio e regista o histórico)
leadsRoutes.put('/negotiations/:id', updateNegotiationController.handle);

export { leadsRoutes };