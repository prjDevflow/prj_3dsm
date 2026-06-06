import { Prisma } from '@prisma/client';
import { AppError } from '../../../shared/errors/AppError';
import { ClientesRepository } from '../repositories/ClientesRepository';

interface IUpdateClienteRequest {
  id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string | null;
  leadId?: string | null;
  consultorId?: string | null;
}

export class UpdateClienteService {
  private clientesRepository: ClientesRepository;

  constructor() {
    this.clientesRepository = new ClientesRepository();
  }

  async execute({ id, nome, email, telefone, cpf, leadId, consultorId }: IUpdateClienteRequest) {
    const cliente = await this.clientesRepository.findById(id);
    if (!cliente) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    if (email && email !== cliente.email_cliente) {
      const emailEmUso = await this.clientesRepository.findByEmail(email);
      if (emailEmUso) {
        throw new AppError('Já existe um cliente com este e-mail.', 400);
      }
    }

    const data: Prisma.ClienteUncheckedUpdateInput = {
      ...(nome != null && { nome_cliente: nome }),
      ...(email != null && { email_cliente: email }),
      ...(telefone != null && { telefone_cliente: telefone }),
      ...(cpf !== undefined && { cpf_cliente: cpf || null }),
      ...(leadId !== undefined && { id_lead_principal: leadId || null }),
      ...(consultorId !== undefined && { id_consultor: consultorId || null }),
    };

    const atualizado = await this.clientesRepository.update(id, data);

    if (leadId) {
      await this.clientesRepository.linkLeadToCliente(leadId, id);
    }

    return {
      id: atualizado.id_cliente,
      name: atualizado.nome_cliente,
      email: atualizado.email_cliente,
      phone: atualizado.telefone_cliente,
      leadId: atualizado.id_lead_principal ?? null,
      consultorId: atualizado.id_consultor ?? null,
    };
  }
}
