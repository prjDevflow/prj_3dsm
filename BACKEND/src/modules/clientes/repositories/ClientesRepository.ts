import { Cliente, Prisma } from '@prisma/client';
import { prisma } from '../../../shared/infra/prisma/client';

/**
 * Camada de acesso a dados do domínio de Clientes.
 * Todo acesso ao banco relacionado a clientes passa por aqui (Repository Pattern).
 */
export class ClientesRepository {
  findByEmail(email_cliente: string): Promise<Cliente | null> {
    return prisma.cliente.findUnique({ where: { email_cliente } });
  }

  findById(id_cliente: string): Promise<Cliente | null> {
    return prisma.cliente.findUnique({ where: { id_cliente } });
  }

  create(data: Prisma.ClienteUncheckedCreateInput): Promise<Cliente> {
    return prisma.cliente.create({ data });
  }

  update(id_cliente: string, data: Prisma.ClienteUncheckedUpdateInput): Promise<Cliente> {
    return prisma.cliente.update({ where: { id_cliente }, data });
  }

  findManyAndCount(
    where: Prisma.ClienteWhereInput,
    skip: number,
    take: number,
  ): Promise<[Cliente[], number]> {
    return Promise.all([
      prisma.cliente.findMany({ where, skip, take, orderBy: { nome_cliente: 'asc' } }),
      prisma.cliente.count({ where }),
    ]);
  }

  async findLeadIdsByUsuario(id_usuario: string): Promise<string[]> {
    const leads = await prisma.lead.findMany({
      where: { id_usuario },
      select: { id_lead: true },
    });
    return leads.map((l) => l.id_lead);
  }

  async findConsultorNamesByIds(ids: string[]): Promise<Record<string, string>> {
    if (ids.length === 0) return {};
    const consultores = await prisma.usuario.findMany({
      where: { id_usuario: { in: ids } },
      select: { id_usuario: true, nome_usuario: true },
    });
    return Object.fromEntries(consultores.map((u) => [u.id_usuario, u.nome_usuario]));
  }

  /** Lista os usuários que podem ser consultores de um cliente. */
  findConsultores() {
    return prisma.usuario.findMany({
      where: {
        papel: { nome_papel: { in: ['ATENDENTE', 'GERENTE', 'GERENTE_GERAL', 'ADMIN'] } },
      },
      select: {
        id_usuario: true,
        nome_usuario: true,
        papel: { select: { nome_papel: true } },
      },
      orderBy: { nome_usuario: 'asc' },
    });
  }

  async linkLeadToCliente(id_lead: string, id_cliente: string): Promise<void> {
    await prisma.lead.updateMany({ where: { id_lead }, data: { id_cliente } });
  }

  /** Remove o cliente e suas dependências (históricos → negociações → leads → cliente). */
  async deleteCascade(id_cliente: string): Promise<void> {
    const leads = await prisma.lead.findMany({
      where: { id_cliente },
      select: { id_lead: true },
    });
    const leadIds = leads.map((l) => l.id_lead);

    if (leadIds.length > 0) {
      const negociacoes = await prisma.negociacao.findMany({
        where: { id_lead: { in: leadIds } },
        select: { id_negociacao: true },
      });
      const negIds = negociacoes.map((n) => n.id_negociacao);

      if (negIds.length > 0) {
        await prisma.historicoNegociacao.deleteMany({ where: { id_negociacao: { in: negIds } } });
        await prisma.negociacao.deleteMany({ where: { id_negociacao: { in: negIds } } });
      }
      await prisma.lead.deleteMany({ where: { id_lead: { in: leadIds } } });
    }

    await prisma.cliente.delete({ where: { id_cliente } });
  }
}
