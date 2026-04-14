import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService'; // Adicione o .js

export class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;
    const authService = new AuthService(); 

    try {
      const result = await authService.execute({ email, senha });
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
}