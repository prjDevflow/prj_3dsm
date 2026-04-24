"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEquipeService = void 0;
const EquipesRepository_1 = require("../repositories/EquipesRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class UpdateEquipeService {
    equipesRepository;
    createLogService;
    constructor() {
        this.equipesRepository = new EquipesRepository_1.EquipesRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ id, nome, usuarioLogadoId }) {
        const equipe = await this.equipesRepository.findById(id);
        if (!equipe) {
            const error = new Error("Equipe não encontrada.");
            error.statusCode = 404;
            throw error;
        }
        const equipeAtualizada = await this.equipesRepository.update(id, nome);
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'EQUIPE',
            entidadeId: equipeAtualizada.id_equipe,
            usuarioResponsavelId: usuarioLogadoId
        });
        return equipeAtualizada;
    }
}
exports.UpdateEquipeService = UpdateEquipeService;
