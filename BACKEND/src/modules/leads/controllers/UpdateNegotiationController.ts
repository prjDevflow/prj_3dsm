// BACKEND/src/modules/leads/controllers/UpdateNegotiationController.ts
import { Request, Response } from 'express';
import { UpdateNegotiationService } from '../services/UpdateNegotiationService';

export class UpdateNegotiationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { statusId, estagioId, importancia } = request.body;
    const usuarioLogadoId = request.user.id; // Extraído do Token de forma segura

    const updateNegotiationService = new UpdateNegotiationService();

    const negociacao = await updateNegotiationService.execute({
      negotiationId: id,
      statusId,
      estagioId,
      importancia,
      usuarioLogadoId
    });

    return response.status(200).json(negociacao);
  }
}