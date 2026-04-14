import { Router } from 'express';
import { ListLogsController } from '../../../../modules/logs/controllers/ListLogsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureRole } from '../middlewares/ensureRole';
import { UserRole } from '../../../../domain/models/UserRole';

const logsRoutes = Router();
const listLogsController = new ListLogsController();

// Apenas ADMIN pode sequer chegar perto desta rota (RF02 + RF07)
logsRoutes.get(
  '/', 
  ensureAuthenticated, 
  ensureRole([UserRole.ADMIN]), 
  listLogsController.handle
);

export { logsRoutes };