"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEquipeService = void 0;
const EquipesRepository_1 = require("../repositories/EquipesRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class CreateEquipeService {
    equipesRepository;
    createLogService;
    constructor() {
        this.equipesRepository = new EquipesRepository_1.EquipesRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ nome, usuarioLogadoId }) {
        const equipeExists = await this.equipesRepository.findByName(nome);
        if (equipeExists) {
            const error = new Error("Já existe uma equipe com este nome.");
            error.statusCode = 400;
            throw error;
        }
        const equipe = await this.equipesRepository.create(nome);
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.CREATE,
            entidade: 'EQUIPE',
            entidadeId: equipe.id_equipe,
            usuarioResponsavelId: usuarioLogadoId
        });
        return equipe;
    }
}
exports.CreateEquipeService = CreateEquipeService;
