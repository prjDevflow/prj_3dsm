import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteLojaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.loja.delete({ where: { id_loja: id } });
    return res.status(204).send();
  }
}
