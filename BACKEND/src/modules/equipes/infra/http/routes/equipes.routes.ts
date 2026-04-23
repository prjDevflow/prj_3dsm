import { Router } from 'express';
import { EquipesController } from '../../../controllers/EquipesController';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../../../shared/infra/http/middlewares/ensureRole';
import { UserRole } from '../../../../../domain/models/UserRole';

const equipesRoutes = Router();
const equipesController = new EquipesController();

// Todas as rotas de equipes exigem autenticação
equipesRoutes.use(ensureAuthenticated);

// A regra de Ouro do RF02: Apenas ADMIN pode gerenciar equipes [cite: 107, 110, 116]
equipesRoutes.use(ensureRole([UserRole.ADMIN]));

equipesRoutes.post('/', equipesController.create);
equipesRoutes.get('/', equipesController.list);
equipesRoutes.put('/:id', equipesController.update);
equipesRoutes.delete('/:id', equipesController.delete);

export { equipesRoutes };