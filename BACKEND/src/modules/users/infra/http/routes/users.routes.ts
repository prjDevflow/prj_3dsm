import { Router } from 'express';
import { UsersManagementController } from '../../../../users/services/UsersManagementController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const usersRoutes = Router();
const usersManagementController = new UsersManagementController();

// Verifica Token
usersRoutes.use(ensureAuthenticated);

// Regra Ouro RF02: Apenas ADMIN pode gerenciar usuários
usersRoutes.use(ensureRole([UserRole.ADMIN]));

// O POST '/' já existe no seu auth.routes.ts ou CreateUserService, 
// então aqui focamos no restante do CRUD
usersRoutes.get('/', usersManagementController.list);
usersRoutes.put('/:id', usersManagementController.update);
usersRoutes.delete('/:id', usersManagementController.delete);

export { usersRoutes };