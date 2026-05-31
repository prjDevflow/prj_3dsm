import { Router } from 'express';

import { CreateLeadController } from '../../../controllers/CreateLeadController';
import { ListLeadsController } from '../../../controllers/ListLeadsController';
import { UpdateLeadController } from '../../../controllers/UpdateLeadController';
import { GetLeadByIdController } from '../../../controllers/GetLeadByIdController';
import { DeleteLeadController } from '../../../controllers/DeleteLeadController';
import { CreateNegotiationController } from '../../../controllers/CreateNegotiationController';
import { UpdateNegotiationController } from '../../../controllers/UpdateNegotiationController';
import { ListNegotiationsByLeadController } from '../../../controllers/ListNegotiationsByLeadController';
import { CloseNegotiationController } from '../../../controllers/CloseNegotiationController';
import { ListLeadHistoryController } from '../../../controllers/ListLeadHistoryController';
import { ImportLeadsController } from '../../../controllers/ImportLeadsController';
import { LembretesController } from '../../../controllers/LembretesController';
import { NPSController } from '../../../controllers/NPSController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const leadsRoutes = Router();

const createLeadController             = new CreateLeadController();
const listLeadsController              = new ListLeadsController();
const updateLeadController             = new UpdateLeadController();
const getLeadByIdController            = new GetLeadByIdController();
const deleteLeadController             = new DeleteLeadController();
const createNegotiationController      = new CreateNegotiationController();
const updateNegotiationController      = new UpdateNegotiationController();
const listNegotiationsByLeadController = new ListNegotiationsByLeadController();
const closeNegotiationController       = new CloseNegotiationController();
const listLeadHistoryController        = new ListLeadHistoryController();
const importLeadsController            = new ImportLeadsController();
const lembretesController              = new LembretesController();
const npsController                    = new NPSController();

leadsRoutes.use(ensureAuthenticated);

// Leads
leadsRoutes.post('/', createLeadController.handle);
leadsRoutes.get('/',   listLeadsController.handle);
leadsRoutes.get('/:id', getLeadByIdController.handle);
leadsRoutes.put(
  '/:id',
  ensureRole([UserRole.ADMIN, UserRole.GERENTE, UserRole.ATENDENTE]),
  updateLeadController.handle,
);
leadsRoutes.delete('/:id', deleteLeadController.handle);

// Importação em massa
leadsRoutes.post('/import', importLeadsController.handle);

// Histórico de atividades
leadsRoutes.get('/:id/history', listLeadHistoryController.handle);

// Lembretes
leadsRoutes.get('/lembretes/hoje',           (req, res) => lembretesController.hoje(req, res));
leadsRoutes.get('/:id/lembretes',            (req, res) => lembretesController.list(req, res));
leadsRoutes.post('/:id/lembretes',           (req, res) => lembretesController.create(req, res));
leadsRoutes.patch('/lembretes/:id/concluir', (req, res) => lembretesController.concluir(req, res));
leadsRoutes.delete('/lembretes/:id',         (req, res) => lembretesController.remove(req, res));

// NPS
leadsRoutes.post('/negotiations/:id/nps', (req, res) => npsController.create(req, res));

// Negociações
leadsRoutes.get('/:id/negotiations', listNegotiationsByLeadController.handle);
leadsRoutes.post('/negotiations', createNegotiationController.handle);
leadsRoutes.put('/negotiations/:id', updateNegotiationController.handle);
leadsRoutes.put('/negotiations/:id/close', closeNegotiationController.handle);

export { leadsRoutes };