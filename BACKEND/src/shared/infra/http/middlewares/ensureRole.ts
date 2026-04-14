import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../../domain/models/UserRole';

/**
 * Middleware para garantir que o utilizador possui um dos papéis (roles) permitidos.
 * RF02 - Controle de Acesso Baseado em Papéis (RBAC)
 */
export function ensureRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // O utilizador deve ser injetado previamente pelo middleware ensureAuthenticated
    const { role } = req.user;

    // Verifica se o papel do utilizador está na lista de papéis permitidos para esta rota
    if (!allowedRoles.includes(role as UserRole)) {
      return res.status(403).json({
        error: "Acesso negado. Não possui permissões suficientes para realizar esta ação."
      });
    }

    return next(); // Se tiver permissão, o fluxo continua para o Controller
  };
}