import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListClientesController {
  async handle(req: Request, res: Response) {
    const { search, page = '1', limit = '20', assignedTo } = req.query as Record<string, string>;
    const { id: userId, role } = req.user;

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { nome_cliente:     { contains: search, mode: 'insensitive' as const } },
        { email_cliente:    { contains: search, mode: 'insensitive' as const } },
        { telefone_cliente: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    // Atendente só vê seus próprios clientes
    if (role === 'ATENDENTE') {
      where.id_consultor = userId;
    } else if (assignedTo) {
      where.id_consultor = assignedTo;
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { nome_cliente: 'asc' },
      }),
      prisma.cliente.count({ where }),
    ]);

    // Busca nomes dos consultores em lote
    const consultorIds = clientes
      .map(c => c.id_consultor)
      .filter((id): id is string => !!id);

    const consultores = consultorIds.length
      ? await prisma.usuario.findMany({
          where: { id_usuario: { in: consultorIds } },
          select: { id_usuario: true, nome_usuario: true },
        })
      : [];

    const consultorMap = Object.fromEntries(
      consultores.map(u => [u.id_usuario, u.nome_usuario])
    );

    const data = clientes.map((c) => ({
      id:          c.id_cliente,
      name:        c.nome_cliente,
      email:       c.email_cliente,
      phone:       c.telefone_cliente,
      cpf:         c.cpf_cliente ?? null,
      leadId:      c.id_lead_principal ?? null,
      consultorId: c.id_consultor ?? null,
      assignedTo:  c.id_consultor ? (consultorMap[c.id_consultor] ?? null) : null,
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    }));

    return res.json({ data, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  }
}
