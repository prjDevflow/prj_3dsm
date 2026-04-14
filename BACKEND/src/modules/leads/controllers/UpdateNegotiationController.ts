import { Request, Response } from 'express';
import { UpdateNegotiationService } from '../services/UpdateNegotiationService';

export class UpdateNegotiationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // ID vem da URL: /leads/negotiations/:id
    const { status, estagio, importancia } = req.body;
    const usuarioLogadoId = req.user.id;

    const updateNegotiationService = new UpdateNegotiationService();

    try {
      const negotiation = await updateNegotiationService.execute({
        negotiationId: id,
        usuarioLogadoId,
        novoStatus: status,
        novoEstagio: estagio,
        novaImportancia: importancia
      });

      return res.json(negotiation);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}