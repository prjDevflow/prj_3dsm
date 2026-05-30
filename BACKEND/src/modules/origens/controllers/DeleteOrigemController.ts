import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteOrigemController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.origem.delete({ where: { id_origem: id } });
    return res.status(204).send();
  }
}
