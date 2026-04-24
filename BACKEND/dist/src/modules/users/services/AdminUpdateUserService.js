"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateUserService = void 0;
const UsersManagementRepository_1 = require("../repositories/UsersManagementRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class AdminUpdateUserService {
    usersRepository;
    createLogService;
    constructor() {
        this.usersRepository = new UsersManagementRepository_1.UsersManagementRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ id, nome, papelId, equipeId, usuarioLogadoId }) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            const error = new Error("Usuário não encontrado.");
            error.statusCode = 404;
            throw error;
        }
        const updatedUser = await this.usersRepository.update(id, {
            nome_usuario: nome,
            id_papel: papelId,
            id_equipe: equipeId
        });
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'USUARIO',
            entidadeId: id,
            usuarioResponsavelId: usuarioLogadoId
        });
        return updatedUser;
    }
}
exports.AdminUpdateUserService = AdminUpdateUserService;
