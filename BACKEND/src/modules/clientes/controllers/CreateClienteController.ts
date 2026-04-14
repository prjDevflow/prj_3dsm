import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateClienteController {
  async handle(req: Request, res: Response) {
    const { nome, email, telefone } = req.body;

    const clienteExiste = await prisma.cliente.findUnique({ where: { email_cliente: email } });
    if (clienteExiste) {
      return res.status(400).json({ error: "Já existe um cliente com este e-mail." });
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome_cliente: nome,
        email_cliente: email,
        telefone_cliente: telefone
      }
    });

    return res.status(201).json(cliente);
  }
}