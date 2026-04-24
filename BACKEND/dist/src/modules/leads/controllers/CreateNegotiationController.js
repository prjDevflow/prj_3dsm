"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNegotiationController = void 0;
const CreateNegotiationService_1 = require("../services/CreateNegotiationService");
class CreateNegotiationController {
    async handle(req, res) {
        try {
            const { leadId, importancia, estagio } = req.body;
            const usuarioLogadoId = req.user.id;
            const createNegotiationService = new CreateNegotiationService_1.CreateNegotiationService();
            const negotiation = await createNegotiationService.execute({
                leadId,
                importancia,
                estagio,
                usuarioLogadoId
            });
            return res.status(201).json(negotiation);
        }
        catch (error) {
            // 1. Imprime o erro real vermelho no terminal do servidor (npm run dev)
            console.error("ERRO DETALHADO NA NEGOCIAÇÃO:", error);
            // 2. Se for o erro do RF03 (Duplicidade), devolvemos o 400 que o teste espera
            if (error.statusCode) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            // 3. Para outros erros, enviamos a mensagem em vez de um `{}` vazio
            return res.status(400).json({ error: error.message || "Erro interno no servidor" });
        }
    }
}
exports.CreateNegotiationController = CreateNegotiationController;
