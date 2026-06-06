import { Request, Response } from 'express';
import { DeleteClienteService } from '../services/DeleteClienteService';

export class DeleteClienteController {
  async handle(req: Request, res: Response) {
    const deleteClienteService = new DeleteClienteService();
    await deleteClienteService.execute(req.params.id);

    return res.status(204).send();
  }
}
