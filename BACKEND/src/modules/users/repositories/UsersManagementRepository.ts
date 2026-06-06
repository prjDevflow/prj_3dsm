import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/infra/prisma/client';


export class UsersManagementRepository {
  async findAll(filters?: { search?: string; role?: string; equipeId?: string }) {
    const where: Prisma.UsuarioWhereInput = {};

    if (filters?.search) {
      where.nome_usuario = { contains: filters.search, mode: 'insensitive' as const };
    }

    if (filters?.role) {
      where.papel = { nome_papel: { equals: filters.role.toUpperCase(), mode: 'insensitive' as const } };
    }

    if (filters?.equipeId) {
      where.id_equipe = filters.equipeId;
    }

    return prisma.usuario.findMany({
      where,
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
