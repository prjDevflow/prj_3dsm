"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const CreateUserService_1 = require("../../auth/services/CreateUserService");
class CreateUserController {
    async handle(req, res) {
        const { name, nome, email, password, senha, role, teamId, equipeId } = req.body;
        const usuarioResponsavelId = req.user.id;
        try {
            const createUserService = new CreateUserService_1.CreateUserService();
            const user = await createUserService.execute({
                nome: name ?? nome,
                email,
                senha: password ?? senha,
                role,
                equipeId: teamId ?? equipeId,
                usuarioResponsavelId,
            });
            return res.status(201).json({
                id: user.id,
                name: user.nome,
                email: user.email,
                role: user.role,
                teamId: user.equipeId,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}
exports.CreateUserController = CreateUserController;
