import { Request, Response } from 'express';
import { UpdateLeadService } from '../services/UpdateLeadService';

export class UpdateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { lojaId, origemId, atendenteId } = request.body;
    
    // Extrai os dados do token JWT com segurança
    const usuarioLogadoId = request.user.id;
    const usuarioLogadoRole = request.user.role;
    const usuarioLogadoEquipeId = request.user.equipeId;

    const updateLeadService = new UpdateLeadService();

    const lead = await updateLeadService.execute({
      leadId: id,
      lojaId,
      origemId,
      atendenteId,
      usuarioLogadoId,
      usuarioLogadoRole,
      usuarioLogadoEquipeId
    });

    return response.status(200).json(lead);
  }
}