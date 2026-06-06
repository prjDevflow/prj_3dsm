import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
  role: string;
  equipeId?: string | null;
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

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET não está definido nas variáveis de ambiente.", 500);
  }

  try {
    
    const decoded = verify(token, secret) as IPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
      equipeId: decoded.equipeId ?? null,
    };

    return next();
  } catch (error: any) {
    console.log("❌ Erro na validação do token:", error.message);
    throw new AppError("Invalid JWT token", 401);
  }
}