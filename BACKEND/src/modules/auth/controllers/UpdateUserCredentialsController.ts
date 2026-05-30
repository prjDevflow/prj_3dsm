import { Request, Response } from 'express';
import { UpdateUserCredentialsService } from '../services/UpdateUserCredentialsService';

export class UpdateUserCredentialsController {
  async handle(request: Request, response: Response): Promise<Response> {
    // A nossa Regra de Ouro: Nunca confiamos no ID enviado no body.
    // Extraímos o ID diretamente do token JWT validado pelo middleware (ensureAuthenticated).
    const userId = request.user.id; 
    
    // Pegamos o que o usuário deseja alterar
    const { email, senha, senhaAtual } = request.body;

    const updateUserCredentialsService = new UpdateUserCredentialsService();

    try {
      const user = await updateUserCredentialsService.execute({
        userId,
        email,
        senha,
        senhaAtual
      });
      return response.status(200).json(user);
    } catch (error: any) {
      return response.status(error.statusCode ?? 400).json({ error: error.message });
    }
  }
}