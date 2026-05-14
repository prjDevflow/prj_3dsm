"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersManagementController = void 0;
const ListUsersService_1 = require("../services/ListUsersService");
const AdminUpdateUserService_1 = require("../services/AdminUpdateUserService");
const DeleteUserService_1 = require("../services/DeleteUserService");
function mapUserToDTO(u) {
    return {
        id: u.id_usuario,
        name: u.nome_usuario,
        email: u.email_usuario,
        role: u.papel?.nome_papel?.toLowerCase() ?? u.role ?? '',
        teamId: u.id_equipe ?? u.equipe?.id_equipe ?? null,
        active: true,
        createdAt: u.data_criacao_usuario?.toISOString() ?? new Date().toISOString(),
        updatedAt: u.data_criacao_usuario?.toISOString() ?? new Date().toISOString(),
    };
}
class UsersManagementController {
    async list(request, response) {
        const page = Math.max(1, parseInt(request.query.page ?? '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit ?? '20', 10)));
        const listUsersService = new ListUsersService_1.ListUsersService();
        const allUsers = await listUsersService.execute();
        const total = allUsers.length;
        const totalPages = Math.ceil(total / limit);
        const paged = allUsers.slice((page - 1) * limit, page * limit);
        return response.status(200).json({
            data: paged.map(mapUserToDTO),
            total,
            page,
            limit,
            totalPages,
        });
    }
    async update(request, response) {
        const { id } = request.params;
        // aceita inglês (name, role, teamId) ou português (nome, papelId, equipeId)
        const { name, nome, role, papelId, teamId, equipeId } = request.body;
        const usuarioLogadoId = request.user.id;
        const adminUpdateUserService = new AdminUpdateUserService_1.AdminUpdateUserService();
        const user = await adminUpdateUserService.execute({
            id,
            nome: name ?? nome,
            papelId: role ?? papelId,
            equipeId: teamId ?? equipeId,
            usuarioLogadoId,
        });
        return response.status(200).json(mapUserToDTO(user));
    }
    async delete(request, response) {
        const { id } = request.params;
        const usuarioLogadoId = request.user.id;
        const deleteUserService = new DeleteUserService_1.DeleteUserService();
        await deleteUserService.execute({ id, usuarioLogadoId });
        return response.status(204).send();
    }
}
exports.UsersManagementController = UsersManagementController;
