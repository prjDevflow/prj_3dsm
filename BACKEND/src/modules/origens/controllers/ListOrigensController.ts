import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListOrigensController {
  async handle(_req: Request, res: Response) {
    const origens = await prisma.origem.findMany({ orderBy: { nome_origem: 'asc' } });
    return res.json(origens.map((o) => ({ id: o.id_origem, nome: o.nome_origem })));
  }
}
