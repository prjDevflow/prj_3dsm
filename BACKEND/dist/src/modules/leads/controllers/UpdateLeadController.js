"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeadController = void 0;
const UpdateLeadService_1 = require("../services/UpdateLeadService");
class UpdateLeadController {
    async handle(request, response) {
        const { id } = request.params;
        const { lojaId, origemId, atendenteId } = request.body;
        // Extrai os dados do token JWT com segurança
        const usuarioLogadoId = request.user.id;
        const usuarioLogadoRole = request.user.role;
        const usuarioLogadoEquipeId = request.user.equipeId;
        const updateLeadService = new UpdateLeadService_1.UpdateLeadService();
        const lead = await updateLeadService.execute({
            leadId: id,
            lojaId,
            origemId,
            atendenteId,
            usuarioLogadoId,
            usuarioLogadoRole,
            usuarioLogadoEquipeId
        });
        return response.status(200).json(lead);
    }
}
exports.UpdateLeadController = UpdateLeadController;
