import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateOrigemController {
  async handle(req: Request, res: Response) {
    const { nome } = req.body;

    const origemExiste = await prisma.origem.findUnique({ where: { nome_origem: nome } });
    if (origemExiste) {
      return res.status(400).json({ error: "Origem já cadastrada." });
    }

    const origem = await prisma.origem.create({
      data: { nome_origem: nome }
    });

    return res.status(201).json(origem);
  }
}