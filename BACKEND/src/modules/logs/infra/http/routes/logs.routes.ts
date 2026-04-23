import { Router } from 'express';
import { ListLogsController } from '../../../controllers/ListLogsController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const logsRoutes = Router();
const listLogsController = new ListLogsController();

// 🔒 Exige que o utilizador esteja autenticado
logsRoutes.use(ensureAuthenticated);

// 🔒 REGRA DE OURO (RF02 e RF07): Apenas Administradores podem aceder à auditoria
logsRoutes.get(
  '/', 
  ensureRole([UserRole.ADMIN]), 
  listLogsController.handle
);

export { logsRoutes };