import { Request, Response } from 'express';
import { DeleteLojaService } from '../services/DeleteLojaService';

export class DeleteLojaController {
  async handle(req: Request, res: Response) {
    const deleteLojaService = new DeleteLojaService();
    await deleteLojaService.execute(req.params.id);

    return res.status(204).send();
  }
}
