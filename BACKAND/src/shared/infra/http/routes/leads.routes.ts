import { Router } from 'express';
import { CreateLeadController } from '../../../../modules/leads/controllers/CreateLeadController';
import { ListLeadsController } from '../../../../modules/leads/controllers/ListLeadsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { createLeadSchema } from '../validators/schemas';



const leadsRoutes = Router();
const createLeadController = new CreateLeadController();
const listLeadsController = new ListLeadsController();

// RF03 - Registro de Leads
leadsRoutes.post(
  '/', 
  ensureAuthenticated, 
  validateRequest(createLeadSchema),
  createLeadController.handle
);
// RF02 - Listagem de Leads com Filtros de Hierarquia
leadsRoutes.get('/', ensureAuthenticated, listLeadsController.handle);

export { leadsRoutes };