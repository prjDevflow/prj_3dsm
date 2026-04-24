"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureRole = void 0;
/**
 * Middleware para garantir que o utilizador possui um dos papéis (roles) permitidos.
 * RF02 - Controle de Acesso Baseado em Papéis (RBAC)
 */
function ensureRole(allowedRoles) {
    return (req, res, next) => {
        // O utilizador deve ser injetado previamente pelo middleware ensureAuthenticated
        const { role } = req.user;
        // Verifica se o papel do utilizador está na lista de papéis permitidos para esta rota
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                error: "Acesso negado. Não possui permissões suficientes para realizar esta ação."
            });
        }
        return next(); // Se tiver permissão, o fluxo continua para o Controller
    };
}
exports.ensureRole = ensureRole;
