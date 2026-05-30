import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListLojasController {
  async handle(_req: Request, res: Response) {
    const lojas = await prisma.loja.findMany({ orderBy: { nome_loja: 'asc' } });
    return res.json(lojas.map((l) => ({ id: l.id_loja, nome: l.nome_loja })));
  }
}
