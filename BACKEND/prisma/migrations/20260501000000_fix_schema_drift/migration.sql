-- ============================================================
-- MIGRATION: fix_schema_drift
-- Sincroniza o banco com o schema.prisma atual:
--   1. Remove colunas removidas da tabela leads
--   2. Adiciona coluna nova na tabela negociacoes
-- ============================================================

-- 1. Remove FK de id_status da tabela leads (se existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leads_id_status_fkey'
      AND table_name = 'leads'
  ) THEN
    ALTER TABLE "leads" DROP CONSTRAINT "leads_id_status_fkey";
  END IF;
END$$;

-- 2. Remove coluna id_status da tabela leads (se existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'id_status'
  ) THEN
    ALTER TABLE "leads" DROP COLUMN "id_status";
  END IF;
END$$;

-- 3. Remove coluna data_atualizacao_lead da tabela leads (se existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'data_atualizacao_lead'
  ) THEN
    ALTER TABLE "leads" DROP COLUMN "data_atualizacao_lead";
  END IF;
END$$;

-- 4. Adiciona coluna motivo_finalizacao_negociacao na tabela negociacoes (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'negociacoes'
      AND column_name = 'motivo_finalizacao_negociacao'
  ) THEN
    ALTER TABLE "negociacoes" ADD COLUMN "motivo_finalizacao_negociacao" TEXT;
  END IF;
END$$;

-- 5. Adiciona coluna id_registro_afetado na tabela logs_operacoes (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'logs_operacoes'
      AND column_name = 'id_registro_afetado'
  ) THEN
    ALTER TABLE "logs_operacoes" ADD COLUMN "id_registro_afetado" UUID;
  END IF;
END$$;
