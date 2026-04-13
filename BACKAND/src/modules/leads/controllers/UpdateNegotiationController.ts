import { Request, Response } from 'express';
import { UpdateNegotiationService } from '../services/UpdateNegotiationService';
import { NegotiationsRepository } from '../repositories/NegotiationsRepository';

export class UpdateNegotiationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status, estagio } = req.body;
    
    // Os dados do utilizador são injetados pelo middleware ensureAuthenticated
    const { id: userId, role } = req.user; 

    const negotiationsRepository = new NegotiationsRepository();
    const updateNegotiationService = new UpdateNegotiationService(negotiationsRepository);

    const negotiation = await updateNegotiationService.execute({
      negotiationId: id,
      userId,
      role,
      status,
      estagio
    });

    return res.json(negotiation);
  }
}