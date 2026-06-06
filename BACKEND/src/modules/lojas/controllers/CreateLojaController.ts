import { Request, Response } from 'express';
import { CreateLojaService } from '../services/CreateLojaService';

export class CreateLojaController {
  async handle(req: Request, res: Response) {
    const createLojaService = new CreateLojaService();
    const loja = await createLojaService.execute(req.body.nome);

    return res.status(201).json(loja);
  }
}
