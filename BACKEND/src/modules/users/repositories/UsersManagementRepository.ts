import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsersManagementRepository {
  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id_usuario:           true,
        nome_usuario:         true,
        email_usuario:        true,
        id_equipe:            true,
        ativo_usuario:        true,
        data_criacao_usuario: true,
        papel:  { select: { nome_papel:  true } },
        equipe: { select: { id_equipe: true, nome_equipe: true } },
      },
    });
  }

  async findById(id_usuario: string) {
    return prisma.usuario.findUnique({
      where: { id_usuario }
    });
  }

  async update(id_usuario: string, data: { nome_usuario?: string; id_papel?: string; id_equipe?: string | null; ativo_usuario?: boolean }) {
    return prisma.usuario.update({
      where: { id_usuario },
      data,
      select: {
        id_usuario:           true,
        nome_usuario:         true,
        email_usuario:        true,
        id_equipe:            true,
        ativo_usuario:        true,
        data_criacao_usuario: true,
        papel:  { select: { nome_papel: true } },
        equipe: { select: { id_equipe: true, nome_equipe: true } },
      },
    });
  }

  async softDelete(id_usuario: string) {
    return prisma.usuario.update({
      where: { id_usuario },
      data: { ativo_usuario: false },
    });
  }

  async delete(id_usuario: string): Promise<void> {
    await prisma.usuario.delete({
      where: { id_usuario }
    });
  }
}
