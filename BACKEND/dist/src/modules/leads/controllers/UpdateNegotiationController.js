"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNegotiationController = void 0;
const UpdateNegotiationService_1 = require("../services/UpdateNegotiationService");
class UpdateNegotiationController {
    async handle(request, response) {
        const { id } = request.params;
        const { statusId, estagioId, importancia } = request.body;
        const usuarioLogadoId = request.user.id; // Extraído do Token de forma segura
        const updateNegotiationService = new UpdateNegotiationService_1.UpdateNegotiationService();
        const negociacao = await updateNegotiationService.execute({
            negotiationId: id,
            statusId,
            estagioId,
            importancia,
            usuarioLogadoId
        });
        return response.status(200).json(negociacao);
    }
}
exports.UpdateNegotiationController = UpdateNegotiationController;
