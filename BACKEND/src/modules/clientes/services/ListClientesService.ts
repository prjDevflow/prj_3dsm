import { Prisma } from '@prisma/client';
import { ClientesRepository } from '../repositories/ClientesRepository';

interface IListClientesRequest {
  search?: string;
  page: number;
  limit: number;
  assignedTo?: string;
  hasLead?: string;
  userId: string;
  role: string;
}

export class ListClientesService {
  private clientesRepository: ClientesRepository;

  constructor() {
    this.clientesRepository = new ClientesRepository();
  }

  async execute({ search, page, limit, assignedTo, hasLead, userId, role }: IListClientesRequest) {
    const skip = (page - 1) * limit;

    const where: Prisma.ClienteWhereInput = {};

    if (search) {
      where.nome_cliente = { contains: search, mode: 'insensitive' as const };
    }

    if (hasLead === 'true') {
      where.id_lead_principal = { not: null };
    } else if (hasLead === 'false') {
      where.id_lead_principal = null;
    }

    // Atendente: vê clientes onde é consultor OU onde o lead vinculado é dele
    if (role === 'ATENDENTE') {
      const leadIds = await this.clientesRepository.findLeadIdsByUsuario(userId);
      where.OR = [
        { id_consultor: userId },
        ...(leadIds.length > 0 ? [{ id_lead_principal: { in: leadIds } }] : []),
      ];
    } else if (assignedTo) {
      where.id_consultor = assignedTo;
    }

    const [clientes, total] = await this.clientesRepository.findManyAndCount(where, skip, limit);

    const consultorIds = clientes
      .map((c) => c.id_consultor)
      .filter((id): id is string => !!id);

    const consultorMap = await this.clientesRepository.findConsultorNamesByIds(consultorIds);

    const data = clientes.map((c) => ({
      id: c.id_cliente,
      name: c.nome_cliente,
      email: c.email_cliente,
      phone: c.telefone_cliente,
      cpf: c.cpf_cliente ?? null,
      leadId: c.id_lead_principal ?? null,
      consultorId: c.id_consultor ?? null,
      assignedTo: c.id_consultor ? (consultorMap[c.id_consultor] ?? null) : null,
      createdAt: c.data_criacao_cliente.toISOString(),
      updatedAt: c.data_criacao_cliente.toISOString(),
    }));

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
