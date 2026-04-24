"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEquipeService = void 0;
const EquipesRepository_1 = require("../repositories/EquipesRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class DeleteEquipeService {
    equipesRepository;
    createLogService;
    constructor() {
        this.equipesRepository = new EquipesRepository_1.EquipesRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ id, usuarioLogadoId }) {
        const equipe = await this.equipesRepository.findById(id);
        if (!equipe) {
            const error = new Error("Equipe não encontrada.");
            error.statusCode = 404;
            throw error;
        }
        try {
            await this.equipesRepository.delete(id);
        }
        catch (err) {
            const error = new Error("Não é possível excluir uma equipe que possui usuários vinculados.");
            error.statusCode = 400;
            throw error;
        }
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.DELETE,
            entidade: 'EQUIPE',
            entidadeId: id,
            usuarioResponsavelId: usuarioLogadoId
        });
    }
}
exports.DeleteEquipeService = DeleteEquipeService;
