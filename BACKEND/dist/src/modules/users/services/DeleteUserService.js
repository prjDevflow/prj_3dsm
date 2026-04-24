"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const UsersManagementRepository_1 = require("../repositories/UsersManagementRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class DeleteUserService {
    usersRepository;
    createLogService;
    constructor() {
        this.usersRepository = new UsersManagementRepository_1.UsersManagementRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ id, usuarioLogadoId }) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            const error = new Error("Usuário não encontrado.");
            error.statusCode = 404;
            throw error;
        }
        // Regra de segurança: O Admin não deve conseguir excluir a si mesmo
        if (id === usuarioLogadoId) {
            const error = new Error("Não é permitido excluir o próprio usuário ativo.");
            error.statusCode = 400;
            throw error;
        }
        try {
            await this.usersRepository.delete(id);
        }
        catch (err) {
            const error = new Error("Não é possível excluir este usuário pois ele possui vínculos (Leads/Históricos).");
            error.statusCode = 400;
            throw error;
        }
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.DELETE,
            entidade: 'USUARIO',
            entidadeId: id,
            usuarioResponsavelId: usuarioLogadoId
        });
    }
}
exports.DeleteUserService = DeleteUserService;
