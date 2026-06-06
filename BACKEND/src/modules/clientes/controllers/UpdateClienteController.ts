import { Request, Response } from 'express';
import { UpdateClienteService } from '../services/UpdateClienteService';

export class UpdateClienteController {
  async handle(req: Request, res: Response) {
    const updateClienteService = new UpdateClienteService();
    const cliente = await updateClienteService.execute({
      id:          req.params.id,
      nome:        req.body.name        ?? req.body.nome,
      email:       req.body.email,
      telefone:    req.body.phone       ?? req.body.telefone,
      cpf:         req.body.cpf,
      leadId:      req.body.leadId      ?? req.body.lead_id,
      consultorId: req.body.consultorId ?? req.body.assignedTo,
    });

    return res.json(cliente);
  }
}
