import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImportRow {
  name: string;
  email: string;
  phone: string;
  store: string;
  origin: string;
  assignedTo?: string;
}

export class ImportLeadsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const rows: ImportRow[] = req.body.rows;
    const { id: userId } = req.user;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Nenhuma linha enviada.' });
    }
    if (rows.length > 500) {
      return res.status(400).json({ error: 'Máximo de 500 leads por importação.' });
    }

    const created: number[] = [];
    const errors: { row: number; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header

      if (!row.name?.trim() || !row.email?.trim() || !row.phone?.trim()) {
        errors.push({ row: rowNum, reason: 'Nome, e-mail e telefone são obrigatórios.' });
        continue;
      }

      try {
        const [loja, origem] = await Promise.all([
          prisma.loja.findFirst({ where: { nome_loja: { equals: row.store?.trim(), mode: 'insensitive' } } }),
          prisma.origem.findFirst({ where: { nome_origem: { equals: row.origin?.trim(), mode: 'insensitive' } } }),
        ]);

        if (!loja) { errors.push({ row: rowNum, reason: `Loja '${row.store}' não encontrada.` }); continue; }
        if (!origem) { errors.push({ row: rowNum, reason: `Origem '${row.origin}' não encontrada.` }); continue; }

        let atendente = userId;
        if (row.assignedTo?.trim()) {
          const u = await prisma.usuario.findFirst({
            where: { nome_usuario: { contains: row.assignedTo.trim(), mode: 'insensitive' } },
          });
          if (u) atendente = u.id_usuario;
        }

        let cliente = await prisma.cliente.findUnique({ where: { email_cliente: row.email.trim().toLowerCase() } });
        if (!cliente) {
          cliente = await prisma.cliente.create({
            data: {
              nome_cliente:     row.name.trim(),
              email_cliente:    row.email.trim().toLowerCase(),
              telefone_cliente: row.phone.trim(),
            },
          });
        }

        await prisma.lead.create({
          data: {
            id_cliente:  cliente.id_cliente,
            id_usuario:  atendente,
            id_loja:     loja.id_loja,
            id_origem:   origem.id_origem,
          },
        });

        created.push(rowNum);
      } catch {
        errors.push({ row: rowNum, reason: 'Erro interno ao processar linha.' });
      }
    }

    return res.status(200).json({
      created: created.length,
      errors,
      total: rows.length,
    });
  }
}
