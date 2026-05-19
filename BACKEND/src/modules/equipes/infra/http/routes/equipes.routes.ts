import { Router } from 'express';
import { EquipesController } from '../../../controllers/EquipesController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const equipesRoutes = Router();
const equipesController = new EquipesController();

equipesRoutes.use(ensureAuthenticated);

equipesRoutes.get('/', equipesController.list);

equipesRoutes.use(ensureRole([UserRole.ADMIN]));
equipesRoutes.post('/', equipesController.create);
equipesRoutes.put('/:id', equipesController.update);
equipesRoutes.delete('/:id', equipesController.delete);

export { equipesRoutes };