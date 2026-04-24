"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../../../errors/AppError");
async function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError("Token missing", 401);
    }
    const [, token] = authHeader.split(" ");
    try {
        // IMPORTANTE: Agora a chave secreta é idêntica à do AuthService
        const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao_desenvolvimento';
        const decoded = (0, jsonwebtoken_1.verify)(token, secret);
        // Injeta os dados do usuário na requisição
        request.user = {
            id: decoded.sub,
            role: decoded.role,
        };
        return next();
    }
    catch (error) {
        console.log("❌ Erro na validação do token:", error.message);
        throw new AppError_1.AppError("Invalid JWT token", 401);
    }
}
exports.ensureAuthenticated = ensureAuthenticated;
