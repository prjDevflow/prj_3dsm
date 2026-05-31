CREATE TABLE "lembretes" (
  "id_lembrete"   UUID        NOT NULL DEFAULT gen_random_uuid(),
  "id_lead"       UUID        NOT NULL,
  "id_usuario"    UUID        NOT NULL,
  "titulo"        VARCHAR(200) NOT NULL,
  "descricao"     TEXT,
  "data_lembrete" TIMESTAMP   NOT NULL,
  "concluido"     BOOLEAN     NOT NULL DEFAULT false,
  "data_criacao"  TIMESTAMP   NOT NULL DEFAULT now(),
  CONSTRAINT "lembretes_pkey" PRIMARY KEY ("id_lembrete"),
  CONSTRAINT "lembretes_id_lead_fkey"    FOREIGN KEY ("id_lead")    REFERENCES "leads"("id_lead")       ON DELETE CASCADE,
  CONSTRAINT "lembretes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario")
);

CREATE TABLE "avaliacoes_nps" (
  "id_avaliacao"   UUID      NOT NULL DEFAULT gen_random_uuid(),
  "id_negociacao"  UUID      NOT NULL,
  "id_lead"        UUID      NOT NULL,
  "pontuacao"      INTEGER   NOT NULL,
  "comentario"     TEXT,
  "data_avaliacao" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "avaliacoes_nps_pkey"            PRIMARY KEY ("id_avaliacao"),
  CONSTRAINT "avaliacoes_nps_id_negociacao_key" UNIQUE ("id_negociacao"),
  CONSTRAINT "avaliacoes_nps_id_negociacao_fkey" FOREIGN KEY ("id_negociacao") REFERENCES "negociacoes"("id_negociacao"),
  CONSTRAINT "avaliacoes_nps_id_lead_fkey"        FOREIGN KEY ("id_lead")        REFERENCES "leads"("id_lead")
);
