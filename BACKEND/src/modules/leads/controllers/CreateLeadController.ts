import { Request, Response } from 'express';
import { prisma } from '../../../shared/infra/prisma/client';
import { CreateLeadService } from '../services/CreateLeadService';


export class CreateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    const usuarioLogadoId = request.user.id;

    // Accept either UUID-based payload (legacy) or human-readable payload
    let { clienteId, lojaId, origemId } = request.body;
    const { name, email, phone, store, origin, assignedTo } = request.body;

    // Resolve clienteId: find-or-create Cliente from name/email/phone
    if (!clienteId && email) {
      let cliente = await prisma.cliente.findFirst({
        where: { email_cliente: { equals: email, mode: 'insensitive' } },
      });
      if (!cliente) {
        cliente = await prisma.cliente.create({
          data: {
            nome_cliente:     name ?? email,
            email_cliente:    email,
            telefone_cliente: phone ?? '',
          },
        });
      }
      clienteId = cliente.id_cliente;
    }

    // Resolve lojaId from store name if not already a UUID
    if (!lojaId && store) {
      const loja = await prisma.loja.findFirst({
        where: { nome_loja: { equals: store, mode: 'insensitive' } },
      });
      if (!loja) {
        return response.status(400).json({ error: `Loja '${store}' não encontrada.` });
      }
      lojaId = loja.id_loja;
    }

    // Resolve origemId from origin name if not already a UUID
    if (!origemId && origin) {
      let origem = await prisma.origem.findFirst({
        where: { nome_origem: { equals: origin, mode: 'insensitive' } },
      });
      if (!origem) {
        // Create origin on-the-fly so new values are accepted
        origem = await prisma.origem.create({ data: { nome_origem: origin } });
      }
      origemId = origem.id_origem;
    }

    if (!clienteId || !lojaId || !origemId) {
      return response.status(400).json({
        error: 'Dados insuficientes para criar o lead. Informe nome, email, loja e origem.',
      });
    }

    const createLeadService = new CreateLeadService();
    const lead = await createLeadService.execute({
      clienteId,
      lojaId,
      origemId,
      usuarioLogadoId: assignedTo ?? usuarioLogadoId,
    });

    return response.status(201).json(lead);
  }
}
