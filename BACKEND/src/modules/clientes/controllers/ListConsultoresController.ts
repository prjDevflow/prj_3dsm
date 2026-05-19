import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListConsultoresController {
  async handle(_req: Request, res: Response) {
    const usuarios = await prisma.usuario.findMany({
      where: {
        papel: { nome_papel: { in: ['ATENDENTE', 'GERENTE', 'GERENTE_GERAL', 'ADMIN'] } },
      },
      select: {
        id_usuario:   true,
        nome_usuario: true,
        papel:        { select: { nome_papel: true } },
      },
      orderBy: { nome_usuario: 'asc' },
    });

    return res.json(
      usuarios.map(u => ({
        id:   u.id_usuario,
        name: u.nome_usuario,
        role: u.papel.nome_papel,
      }))
    );
  }
}
