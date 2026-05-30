import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateLojaController {
  async handle(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome?.trim()) {
      return res.status(400).json({ error: "Nome da loja é obrigatório." });
    }

    const lojaExiste = await prisma.loja.findFirst({ where: { nome_loja: nome.trim() } });
    if (lojaExiste) {
      return res.status(400).json({ error: "Loja já cadastrada." });
    }

    const loja = await prisma.loja.create({
      data: { nome_loja: nome.trim() }
    });

    return res.status(201).json({ id: loja.id_loja, nome: loja.nome_loja });
  }
}