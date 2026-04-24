"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeadController = void 0;
const CreateLeadService_1 = require("../services/CreateLeadService");
class CreateLeadController {
    async handle(request, response) {
        // 1. Extrai apenas os dados comerciais enviados no corpo da requisição
        const { clienteId, lojaId, origemId } = request.body;
        // 2. Extrai o ID do usuário de forma segura a partir do Token JWT validado
        const usuarioLogadoId = request.user.id;
        const createLeadService = new CreateLeadService_1.CreateLeadService();
        // 3. Executa o serviço passando exatamente o que a interface ICreateLeadRequest espera
        const lead = await createLeadService.execute({
            clienteId,
            lojaId,
            origemId,
            usuarioLogadoId
        });
        return response.status(201).json(lead);
    }
}
exports.CreateLeadController = CreateLeadController;
