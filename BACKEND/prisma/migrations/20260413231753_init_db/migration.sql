-- CreateTable
CREATE TABLE "papeis" (
    "id_papel" UUID NOT NULL,
    "nome_papel" VARCHAR(50) NOT NULL,

    CONSTRAINT "papeis_pkey" PRIMARY KEY ("id_papel")
);

-- CreateTable
CREATE TABLE "equipes" (
    "id_equipe" UUID NOT NULL,
    "nome_equipe" VARCHAR(100) NOT NULL,

    CONSTRAINT "equipes_pkey" PRIMARY KEY ("id_equipe")
);

-- CreateTable
CREATE TABLE "lojas" (
    "id_loja" UUID NOT NULL,
    "nome_loja" VARCHAR(100) NOT NULL,

    CONSTRAINT "lojas_pkey" PRIMARY KEY ("id_loja")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" UUID NOT NULL,
    "nome_usuario" VARCHAR(150) NOT NULL,
    "email_usuario" VARCHAR(150) NOT NULL,
    "senha_hash_usuario" VARCHAR(255) NOT NULL,
    "id_papel" UUID NOT NULL,
    "id_equipe" UUID,
    "data_criacao_usuario" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" UUID NOT NULL,
    "nome_cliente" VARCHAR(150) NOT NULL,
    "telefone_cliente" VARCHAR(20) NOT NULL,
    "email_cliente" VARCHAR(150) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "origens" (
    "id_origem" UUID NOT NULL,
    "nome_origem" VARCHAR(50) NOT NULL,

    CONSTRAINT "origens_pkey" PRIMARY KEY ("id_origem")
);

-- CreateTable
CREATE TABLE "status" (
    "id_status" UUID NOT NULL,
    "nome_status" VARCHAR(50) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "estagios" (
    "id_estagio" UUID NOT NULL,
    "nome_estagio" VARCHAR(50) NOT NULL,

    CONSTRAINT "estagios_pkey" PRIMARY KEY ("id_estagio")
);

-- CreateTable
CREATE TABLE "leads" (
    "id_lead" UUID NOT NULL,
    "id_cliente" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_loja" UUID NOT NULL,
    "id_origem" UUID NOT NULL,
    "id_status" UUID NOT NULL,
    "data_criacao_lead" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao_lead" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id_lead")
);

-- CreateTable
CREATE TABLE "negociacoes" (
    "id_negociacao" UUID NOT NULL,
    "id_lead" UUID NOT NULL,
    "estado_abertura_negociacao" BOOLEAN NOT NULL DEFAULT true,
    "importancia_negociacao" VARCHAR(20) NOT NULL,
    "data_criacao_negociacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_estagio" UUID NOT NULL,
    "id_status" UUID NOT NULL,

    CONSTRAINT "negociacoes_pkey" PRIMARY KEY ("id_negociacao")
);

-- CreateTable
CREATE TABLE "historicos_negociacoes" (
    "id_historico" UUID NOT NULL,
    "id_negociacao" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "detalhe_alteracao_historico" TEXT NOT NULL,
    "data_alteracao_historico" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicos_negociacoes_pkey" PRIMARY KEY ("id_historico")
);

-- CreateTable
CREATE TABLE "logs_operacoes" (
    "id_log" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "acao_log" VARCHAR(50) NOT NULL,
    "tabela_afetada_log" VARCHAR(50) NOT NULL,
    "id_registro_afetado" UUID,
    "data_hora_log" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_operacoes_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "papeis_nome_papel_key" ON "papeis"("nome_papel");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_usuario_key" ON "usuarios"("email_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_cliente_key" ON "clientes"("email_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "origens_nome_origem_key" ON "origens"("nome_origem");

-- CreateIndex
CREATE UNIQUE INDEX "status_nome_status_key" ON "status"("nome_status");

-- CreateIndex
CREATE UNIQUE INDEX "estagios_nome_estagio_key" ON "estagios"("nome_estagio");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_papel_fkey" FOREIGN KEY ("id_papel") REFERENCES "papeis"("id_papel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_equipe_fkey" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id_equipe") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_loja_fkey" FOREIGN KEY ("id_loja") REFERENCES "lojas"("id_loja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_origem_fkey" FOREIGN KEY ("id_origem") REFERENCES "origens"("id_origem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negociacoes" ADD CONSTRAINT "negociacoes_id_lead_fkey" FOREIGN KEY ("id_lead") REFERENCES "leads"("id_lead") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negociacoes" ADD CONSTRAINT "negociacoes_id_estagio_fkey" FOREIGN KEY ("id_estagio") REFERENCES "estagios"("id_estagio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negociacoes" ADD CONSTRAINT "negociacoes_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_negociacoes" ADD CONSTRAINT "historicos_negociacoes_id_negociacao_fkey" FOREIGN KEY ("id_negociacao") REFERENCES "negociacoes"("id_negociacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_negociacoes" ADD CONSTRAINT "historicos_negociacoes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_operacoes" ADD CONSTRAINT "logs_operacoes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
