import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
  role: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    // IMPORTANTE: Agora a chave secreta é idêntica à do AuthService
    const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao_desenvolvimento';
    
    const decoded = verify(token, secret) as IPayload;

    // Injeta os dados do usuário na requisição
    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch (error: any) {
    console.log("❌ Erro na validação do token:", error.message);
    throw new AppError("Invalid JWT token", 401);
  }
}