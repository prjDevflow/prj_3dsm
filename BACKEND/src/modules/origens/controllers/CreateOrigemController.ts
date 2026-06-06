import { Request, Response } from 'express';
import { CreateOrigemService } from '../services/CreateOrigemService';

export class CreateOrigemController {
  async handle(req: Request, res: Response) {
    const createOrigemService = new CreateOrigemService();
    const origem = await createOrigemService.execute(req.body.nome);

    return res.status(201).json(origem);
  }
}
