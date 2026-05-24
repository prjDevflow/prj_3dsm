import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UpdateClienteController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const nome        = req.body.name        ?? req.body.nome;
    const email       = req.body.email;
    const telefone    = req.body.phone       ?? req.body.telefone;
    const cpf         = req.body.cpf;
    const leadId      = req.body.leadId      ?? req.body.lead_id;
    const consultorId = req.body.consultorId ?? req.body.assignedTo;

    const cliente = await prisma.cliente.findUnique({ where: { id_cliente: id } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    if (email && email !== cliente.email_cliente) {
      const emailEmUso = await prisma.cliente.findUnique({ where: { email_cliente: email } });
      if (emailEmUso) {
        return res.status(400).json({ error: 'Já existe um cliente com este e-mail.' });
      }
    }

    const atualizado = await prisma.cliente.update({
      where: { id_cliente: id },
      data: {
        ...(nome        != null  && { nome_cliente:      nome }),
        ...(email       != null  && { email_cliente:     email }),
        ...(telefone    != null  && { telefone_cliente:  telefone }),
        ...(cpf         !== undefined && { cpf_cliente:  cpf || null }),
        ...(leadId      !== undefined && { id_lead_principal: leadId || null }),
        ...(consultorId !== undefined && { id_consultor:      consultorId || null }),
      },
    });

    if (leadId) {
      await prisma.lead.updateMany({
        where: { id_lead: leadId },
        data:  { id_cliente: id },
      });
    }

    return res.json({
      id:          atualizado.id_cliente,
      name:        atualizado.nome_cliente,
      email:       atualizado.email_cliente,
      phone:       atualizado.telefone_cliente,
      leadId:      atualizado.id_lead_principal ?? null,
      consultorId: atualizado.id_consultor ?? null,
    });
  }
}
