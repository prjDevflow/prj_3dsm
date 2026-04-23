import { PrismaClient, Equipe } from '@prisma/client';

const prisma = new PrismaClient();

export class EquipesRepository {
  async create(nome_equipe: string): Promise<Equipe> {
    return prisma.equipe.create({
      data: { nome_equipe }
    });
  }

  async findAll(): Promise<Equipe[]> {
    return prisma.equipe.findMany();
  }

  async findById(id_equipe: string): Promise<Equipe | null> {
    return prisma.equipe.findUnique({
      where: { id_equipe }
    });
  }

  async findByName(nome_equipe: string): Promise<Equipe | null> {
    return prisma.equipe.findFirst({
      where: { nome_equipe }
    });
  }

  async update(id_equipe: string, nome_equipe: string): Promise<Equipe> {
    return prisma.equipe.update({
      where: { id_equipe },
      data: { nome_equipe }
    });
  }

  async delete(id_equipe: string): Promise<void> {
    await prisma.equipe.delete({
      where: { id_equipe }
    });
  }
}