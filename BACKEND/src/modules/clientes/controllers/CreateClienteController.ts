import { Request, Response } from 'express';
import { CreateClienteService } from '../services/CreateClienteService';

export class CreateClienteController {
  async handle(req: Request, res: Response) {
    const createClienteService = new CreateClienteService();
    const cliente = await createClienteService.execute({
      nome:        req.body.name        ?? req.body.nome,
      email:       req.body.email,
      telefone:    req.body.phone       ?? req.body.telefone,
      cpf:         req.body.cpf         ?? null,
      leadId:      req.body.leadId      ?? req.body.lead_id    ?? null,
      consultorId: req.body.consultorId ?? req.body.assignedTo ?? null,
    });

    return res.status(201).json(cliente);
  }
}
