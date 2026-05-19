/*
  Warnings:

  - You are about to drop the column `data_atualizacao_lead` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `id_status` on the `leads` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_id_status_fkey";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "data_atualizacao_lead",
DROP COLUMN "id_status";

-- AlterTable
ALTER TABLE "negociacoes" ADD COLUMN     "motivo_finalizacao_negociacao" TEXT,
ALTER COLUMN "importancia_negociacao" SET DATA TYPE VARCHAR(50);
