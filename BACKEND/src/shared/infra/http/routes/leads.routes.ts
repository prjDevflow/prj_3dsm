import { Router } from 'express';
import { CreateLeadController } from '../../../../modules/leads/controllers/CreateLeadController';
import { CreateNegotiationController } from '../../../../modules/leads/controllers/CreateNegotiationController';
import { ListLeadsController } from '../../../../modules/leads/controllers/ListLeadsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { UpdateNegotiationController } from '../../../../modules/leads/controllers/UpdateNegotiationController';


const leadsRoutes = Router();
const updateNegotiationController = new UpdateNegotiationController();
const createLeadController = new CreateLeadController();
const createNegotiationController = new CreateNegotiationController();
const listLeadsController = new ListLeadsController();

// Todas as rotas de leads exigem que o utilizador esteja autenticado
leadsRoutes.use(ensureAuthenticated);

// Rotas de Leads
leadsRoutes.post('/', createLeadController.handle);
leadsRoutes.get('/', listLeadsController.handle);
leadsRoutes.put('/negotiations/:id', ensureAuthenticated, updateNegotiationController.handle);
// Rotas de Negociações
leadsRoutes.post('/negotiations', createNegotiationController.handle);

export { leadsRoutes };