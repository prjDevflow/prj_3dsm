"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipesController = void 0;
const CreateEquipeService_1 = require("../services/CreateEquipeService");
const ListEquipesService_1 = require("../services/ListEquipesService");
const UpdateEquipeService_1 = require("../services/UpdateEquipeService");
const DeleteEquipeService_1 = require("../services/DeleteEquipeService");
class EquipesController {
    async create(request, response) {
        const { nome } = request.body;
        const usuarioLogadoId = request.user.id;
        const createEquipeService = new CreateEquipeService_1.CreateEquipeService();
        const equipe = await createEquipeService.execute({ nome, usuarioLogadoId });
        return response.status(201).json(equipe);
    }
    async list(request, response) {
        const listEquipesService = new ListEquipesService_1.ListEquipesService();
        const equipes = await listEquipesService.execute();
        return response.status(200).json(equipes);
    }
    async update(request, response) {
        const { id } = request.params;
        const { nome } = request.body;
        const usuarioLogadoId = request.user.id;
        const updateEquipeService = new UpdateEquipeService_1.UpdateEquipeService();
        const equipe = await updateEquipeService.execute({ id, nome, usuarioLogadoId });
        return response.status(200).json(equipe);
    }
    async delete(request, response) {
        const { id } = request.params;
        const usuarioLogadoId = request.user.id;
        const deleteEquipeService = new DeleteEquipeService_1.DeleteEquipeService();
        await deleteEquipeService.execute({ id, usuarioLogadoId });
        return response.status(204).send();
    }
}
exports.EquipesController = EquipesController;
