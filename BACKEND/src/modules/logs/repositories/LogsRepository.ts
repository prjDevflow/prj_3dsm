import { PrismaClient } from '@prisma/client';
import { Log, LogAction } from "../../../domain/models/Log";

// Instancia o PrismaClient para comunicar com o PostgreSQL
const prisma = new PrismaClient();

export class LogsRepository {
  
  /**
   * RF07 - Registar operações no sistema
   */
  async create(data: Partial<Log>): Promise<Log> {
    // Insere o log diretamente na tabela 'logs_operacoes' do PostgreSQL
    const logCriado = await prisma.logOperacao.create({
      data: {
        id_usuario: data.usuarioResponsavelId!,
        acao_log: data.acao!,
        tabela_afetada_log: data.entidade!,
        id_registro_afetado: data.entidadeId || null,
        // data_hora_log: omitimos pois o Prisma já preenche com o default(now())
      }
    });

    // Mapeia o retorno do Banco de Dados para o formato do nosso Domínio (Model)
    return {
      id: logCriado.id_log,
      acao: logCriado.acao_log as LogAction,
      entidade: logCriado.tabela_afetada_log,
      entidadeId: logCriado.id_registro_afetado || undefined,
      usuarioResponsavelId: logCriado.id_usuario,
      criadoEm: logCriado.data_hora_log
    };
  }

  /**
   * RF07 - Listar logs (Restrito a Administradores no Service)
   */
  async findAll(): Promise<Log[]> {
    // Busca todos os logs na base de dados, ordenados do mais recente para o mais antigo
    const logs = await prisma.logOperacao.findMany({
      orderBy: {
        data_hora_log: 'desc' // Ordenação feita diretamente via SQL/Prisma
      }
    });

    // Mapeia a lista retornada pelo Prisma para a nossa entidade de Domínio
    return logs.map(log => ({
      id: log.id_log,
      acao: log.acao_log as LogAction,
      entidade: log.tabela_afetada_log,
      entidadeId: log.id_registro_afetado || undefined,
      usuarioResponsavelId: log.id_usuario,
      criadoEm: log.data_hora_log
    }));
  }
}