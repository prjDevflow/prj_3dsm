import { Request, Response } from 'express';
import { DeleteOrigemService } from '../services/DeleteOrigemService';

export class DeleteOrigemController {
  async handle(req: Request, res: Response) {
    const deleteOrigemService = new DeleteOrigemService();
    await deleteOrigemService.execute(req.params.id);

    return res.status(204).send();
  }
}
