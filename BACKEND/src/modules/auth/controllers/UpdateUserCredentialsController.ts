import { Request, Response } from 'express';
import { UpdateUserCredentialsService } from '../services/UpdateUserCredentialsService';

export class UpdateUserCredentialsController {
  async handle(request: Request, response: Response): Promise<Response> {
    // A nossa Regra de Ouro: Nunca confiamos no ID enviado no body.
    // Extraímos o ID diretamente do token JWT validado pelo middleware (ensureAuthenticated).
    const userId = request.user.id; 
    
    // Pegamos o que o usuário deseja alterar
    const { email, senha } = request.body;

    const updateUserCredentialsService = new UpdateUserCredentialsService();

    // Passamos para a camada de serviço
    const user = await updateUserCredentialsService.execute({
      userId,
      email,
      senha
    });

    return response.status(200).json(user);
  }
}