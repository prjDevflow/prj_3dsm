import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateLojaController {
  async handle(req: Request, res: Response) {
    const { nome } = req.body;

    const loja = await prisma.loja.create({
      data: { nome_loja: nome }
    });

    return res.status(201).json(loja);
  }
}