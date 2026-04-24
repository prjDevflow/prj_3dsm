"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersManagementController = void 0;
const ListUsersService_1 = require("../services/ListUsersService");
const AdminUpdateUserService_1 = require("../services/AdminUpdateUserService");
const DeleteUserService_1 = require("../services/DeleteUserService");
class UsersManagementController {
    async list(request, response) {
        const listUsersService = new ListUsersService_1.ListUsersService();
        const users = await listUsersService.execute();
        return response.status(200).json(users);
    }
    async update(request, response) {
        const { id } = request.params;
        const { nome, papelId, equipeId } = request.body;
        const usuarioLogadoId = request.user.id;
        const adminUpdateUserService = new AdminUpdateUserService_1.AdminUpdateUserService();
        const user = await adminUpdateUserService.execute({
            id,
            nome,
            papelId,
            equipeId,
            usuarioLogadoId
        });
        return response.status(200).json(user);
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
