import { PrismaClient } from '@prisma/client';

/**
 * Singleton do Prisma Client.
 *
 * Uma única instância é compartilhada por toda a aplicação para evitar a
 * abertura de múltiplos pools de conexão com o PostgreSQL ("too many
 * connections"). Importe sempre `prisma` deste módulo — nunca instancie
 * o PrismaClient diretamente em outros arquivos.
 */
export const prisma = new PrismaClient();
