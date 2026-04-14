import { Router } from 'express';
import { AuthenticateUserController } from '../../../controllers/AuthenticateUserController';
import { validateRequest } from '../../../../../shared/infra/http/middlewares/validateRequest';
import { loginSchema } from '../../../../../shared/infra/http/validators/schemas';

const authRoutes = Router();
const authenticateUserController = new AuthenticateUserController();


authRoutes.post(
  '/', 
  validateRequest(loginSchema), 
  authenticateUserController.handle
);
export { authRoutes };