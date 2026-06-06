import { Origem } from '@prisma/client';
import { prisma } from '../../../shared/infra/prisma/client';

export class OrigensRepository {
  findAll(): Promise<Origem[]> {
    return prisma.origem.findMany({ orderBy: { nome_origem: 'asc' } });
  }

  findByName(nome_origem: string): Promise<Origem | null> {
    return prisma.origem.findUnique({ where: { nome_origem } });
  }

  create(nome_origem: string): Promise<Origem> {
    return prisma.origem.create({ data: { nome_origem } });
  }

  async delete(id_origem: string): Promise<void> {
    await prisma.origem.delete({ where: { id_origem } });
  }
}
