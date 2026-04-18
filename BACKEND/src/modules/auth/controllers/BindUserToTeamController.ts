import { Request, Response } from 'express';
import { BindUserToTeamService } from '../services/BindUserToTeamService';

export class BindUserToTeamController {
  async handle(request: Request, response: Response): Promise<Response> {
    // ID do Gerente vem do Token JWT (Seguro)
    const gerenteLogadoId = request.user.id; 
    
    // ID do Atendente vem da URL (ex: /users/123-uuid/bind)
    const { atendenteId } = request.params;

    const bindUserToTeamService = new BindUserToTeamService();

    const user = await bindUserToTeamService.execute({
      gerenteLogadoId,
      atendenteAlvoId: atendenteId
    });

    return response.status(200).json(user);
  }
}