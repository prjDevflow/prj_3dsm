"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindUserToTeamController = void 0;
const BindUserToTeamService_1 = require("../services/BindUserToTeamService");
class BindUserToTeamController {
    async handle(request, response) {
        // ID do Gerente vem do Token JWT (Seguro)
        const gerenteLogadoId = request.user.id;
        // ID do Atendente vem da URL (ex: /users/123-uuid/bind)
        const { atendenteId } = request.params;
        const bindUserToTeamService = new BindUserToTeamService_1.BindUserToTeamService();
        const user = await bindUserToTeamService.execute({
            gerenteLogadoId,
            atendenteAlvoId: atendenteId
        });
        return response.status(200).json(user);
    }
}
exports.BindUserToTeamController = BindUserToTeamController;
