import { Request, Response } from 'express';
import { CreateLeadService } from '../services/CreateLeadService';

export class CreateLeadController {
  async handle(req: Request, res: Response): Promise<Response> {
    // Adicionamos 'origemId' para capturar o que vem do teste automatizado
    const { clienteId, lojaId, origem, origemId } = req.body;
    
    // O ID de quem cria é retirado do Token JWT pelo nosso middleware
    const atendenteId = req.user.id; 

    const createLeadService = new CreateLeadService();

    const lead = await createLeadService.execute({
      clienteId,
      atendenteId,
      lojaId,
      origem: origemId || origem 
    });

    return res.status(201).json(lead);
  }
}