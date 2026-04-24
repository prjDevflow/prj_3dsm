"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserCredentialsController = void 0;
const UpdateUserCredentialsService_1 = require("../services/UpdateUserCredentialsService");
class UpdateUserCredentialsController {
    async handle(request, response) {
        // A nossa Regra de Ouro: Nunca confiamos no ID enviado no body.
        // Extraímos o ID diretamente do token JWT validado pelo middleware (ensureAuthenticated).
        const userId = request.user.id;
        // Pegamos o que o usuário deseja alterar
        const { email, senha } = request.body;
        const updateUserCredentialsService = new UpdateUserCredentialsService_1.UpdateUserCredentialsService();
        // Passamos para a camada de serviço
        const user = await updateUserCredentialsService.execute({
            userId,
            email,
            senha
        });
        return response.status(200).json(user);
    }
}
exports.UpdateUserCredentialsController = UpdateUserCredentialsController;
