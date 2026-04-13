import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
  role: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado." });
  }

  // O formato esperado é "Bearer <token>"
  const [, token] = authHeader.split(" ");

  try {
    // Valida o token usando o segredo do .ENV [cite: 192]
    const { sub, role } = verify(token, process.env.JWT_SECRET as string) as IPayload;

    // Adiciona os dados do usuário na requisição para uso posterior (RF02)
    req.user = {
      id: sub,
      role: role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}