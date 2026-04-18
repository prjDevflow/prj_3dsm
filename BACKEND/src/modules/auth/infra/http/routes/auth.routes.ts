import { Router } from 'express';
import { AuthenticateUserController } from '../../../controllers/AuthenticateUserController';
import { validateRequest } from '../../../../../shared/infra/http/middlewares/validateRequest';
import { loginSchema } from '../../../../../shared/infra/http/validators/schemas';
import { UpdateUserCredentialsController } from '../../../controllers/UpdateUserCredentialsController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { BindUserToTeamController } from '../../../controllers/BindUserToTeamController';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';


const authRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const updateCredentialsController = new UpdateUserCredentialsController();
const bindUserToTeamController = new BindUserToTeamController();


authRoutes.post(
  '/', 
  validateRequest(loginSchema), 
  authenticateUserController.handle
);
export { authRoutes };

authRoutes.put(
  '/me/credentials', 
  ensureAuthenticated, 
  updateCredentialsController.handle
);

authRoutes.patch(
  '/users/:atendenteId/bind-team',
  ensureAuthenticated,
  ensureRole([UserRole.GERENTE, UserRole.GERENTE_GERAL, UserRole.ADMIN]),
  bindUserToTeamController.handle
);