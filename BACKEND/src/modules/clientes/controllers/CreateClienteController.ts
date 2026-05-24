import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateClienteController {
  async handle(req: Request, res: Response) {
    const nome        = req.body.name        ?? req.body.nome;
    const email       = req.body.email;
    const telefone    = req.body.phone       ?? req.body.telefone;
    const cpf         = req.body.cpf         ?? null;
    const leadId      = req.body.leadId      ?? req.body.lead_id   ?? null;
    const consultorId = req.body.consultorId ?? req.body.assignedTo ?? null;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'Nome, e-mail e telefone são obrigatórios.' });
    }

    const clienteExiste = await prisma.cliente.findUnique({ where: { email_cliente: email } });
    if (clienteExiste) {
      return res.status(400).json({ error: 'Já existe um cliente com este e-mail.' });
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome_cliente:      nome,
        email_cliente:     email,
        telefone_cliente:  telefone,
        cpf_cliente:       cpf,
        id_lead_principal: leadId,
        id_consultor:      consultorId,
      },
    });

    if (leadId) {
      await prisma.lead.updateMany({
        where: { id_lead: leadId },
        data:  { id_cliente: cliente.id_cliente },
      });
    }

    return res.status(201).json({
      id:          cliente.id_cliente,
      name:        cliente.nome_cliente,
      email:       cliente.email_cliente,
      phone:       cliente.telefone_cliente,
      leadId:      cliente.id_lead_principal ?? null,
      consultorId: cliente.id_consultor ?? null,
    });
  }
}
