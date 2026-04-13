import { Request, Response } from 'express';
import { LeadsRepository } from '../repositories/LeadsRepository';
import { LeadStatus } from '../../../domain/models/Lead';
export class CreateLeadController {
  private leadsRepository: LeadsRepository;

  constructor() {
    this.leadsRepository = new LeadsRepository();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const { clienteId, lojaId, origem } = req.body;
    const atendenteId = req.user.id; 

    try {
      const lead = await this.leadsRepository.create({
        clienteId,
        atendenteId,
        lojaId,
        origem,
        status: LeadStatus.NOVO
      });

      return res.status(201).json({ 
        message: "Lead criado com sucesso!", 
        lead 
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}