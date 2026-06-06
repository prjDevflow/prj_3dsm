import { Loja } from '@prisma/client';
import { prisma } from '../../../shared/infra/prisma/client';

export class LojasRepository {
  findAll(): Promise<Loja[]> {
    return prisma.loja.findMany({ orderBy: { nome_loja: 'asc' } });
  }

  findByName(nome_loja: string): Promise<Loja | null> {
    return prisma.loja.findFirst({ where: { nome_loja } });
  }

  create(nome_loja: string): Promise<Loja> {
    return prisma.loja.create({ data: { nome_loja } });
  }

  async delete(id_loja: string): Promise<void> {
    await prisma.loja.delete({ where: { id_loja } });
  }
}
