-- Adiciona a coluna `observacao_negociacao`, presente no schema.prisma (model Negociacao)
-- porém ausente nas migrations anteriores, o que causava erro Prisma P2022 ao consultar leads/negociações.
ALTER TABLE "negociacoes" ADD COLUMN IF NOT EXISTS "observacao_negociacao" TEXT;
