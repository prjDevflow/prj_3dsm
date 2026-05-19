-- Registra as migrations do Prisma como já aplicadas.
-- Isso evita que o backend tente recriar tabelas que já existem.
-- Os checksums são o SHA-256 dos arquivos migration.sql correspondentes.

CREATE TABLE "_prisma_migrations" (
    "id"                  VARCHAR(36)  NOT NULL,
    "checksum"            VARCHAR(64)  NOT NULL,
    "finished_at"         TIMESTAMPTZ,
    "migration_name"      VARCHAR(255) NOT NULL,
    "logs"                TEXT,
    "rolled_back_at"      TIMESTAMPTZ,
    "started_at"          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER      NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES
    (gen_random_uuid()::text, '2398cd7f1ad1c8bc7391a8ca018b8cda427f626c84268d886d8b349bfaf1e81f', now(), '20260413231753_init_db',              NULL, NULL, now(), 1),
    (gen_random_uuid()::text, '8dbdd8509ea3cacef399cba4ae9b911ae03e2c5d7d5b98cffa263788be0fad2d', now(), '20260501000000_fix_schema_drift', NULL, NULL, now(), 1);
