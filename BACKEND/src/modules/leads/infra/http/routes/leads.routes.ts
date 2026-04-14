import { Router } from 'express';
// Retrocede 3 níveis: routes -> http -> infra -> chega a 'leads', depois entra em 'controllers'
import { UpdateNegotiationController } from '../../../controllers/UpdateNegotiationController';

// Retrocede 5 níveis: routes -> http -> infra -> leads -> modules -> chega a 'src', depois entra em 'shared...'
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';

// Retrocede 5 níveis: chega a 'src', depois entra em 'domain...'
import { UserRole } from '../../../../../domain/models/UserRole';

const leadsRoutes = Router();
const updateNegotiationController = new UpdateNegotiationController();

// Aplicação do RF02 - RBAC na rota de negociações
leadsRoutes.put(
  '/negotiations/:id',
  ensureAuthenticated,
  ensureRole([
    UserRole.ATENDENTE, 
    UserRole.GERENTE, 
    UserRole.GERENTE_GERAL, 
    UserRole.ADMIN
  ]),
  updateNegotiationController.handle
);

export { leadsRoutes };