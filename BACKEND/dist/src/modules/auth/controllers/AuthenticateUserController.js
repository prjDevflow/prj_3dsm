"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserController = void 0;
const AuthService_1 = require("../services/AuthService"); // Adicione o .js
class AuthenticateUserController {
    async handle(req, res) {
        const { email, senha } = req.body;
        const authService = new AuthService_1.AuthService();
        try {
            const result = await authService.execute({ email, senha });
            return res.json(result);
        }
        catch (err) {
            return res.status(401).json({ error: err.message });
        }
    }
}
exports.AuthenticateUserController = AuthenticateUserController;
