import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LogsRepository {
  // Chamado por debaixo dos panos pelos outros serviços
  async create(data: { id_usuario: string; acao_log: string; tabela_afetada_log: string; id_registro_afetado?: string | null }) {
    return prisma.logOperacao.create({
      data
    });
  }

  // Chamado apenas pelo Administrador
  async findAll() {
    return prisma.logOperacao.findMany({
      orderBy: { data_hora_log: 'desc' }, // Traz os mais recentes primeiro
      include: {
        usuario: {
          select: { nome_usuario: true, email_usuario: true }
        }
      }
    });
  }
}