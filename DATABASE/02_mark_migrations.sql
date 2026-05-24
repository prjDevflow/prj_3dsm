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
    (gen_random_uuid()::text, '2398cd7f1ad1c8bc7391a8ca018b8cda427f626c84268d886d8b349bfaf1e81f', now(), '20260413231753_init_db',                          NULL, NULL, now(), 1),
    (gen_random_uuid()::text, '9a245a0bb6eed9aa13562a26ef183d89d8d060383c7a85dd6ade8f3ff2859a68', now(), '20260422231422_22_04',                          NULL, NULL, now(), 1),
    (gen_random_uuid()::text, '8dbdd8509ea3cacef399cba4ae9b911ae03e2c5d7d5b98cffa263788be0fad2d', now(), '20260501000000_fix_schema_drift',               NULL, NULL, now(), 1),
    (gen_random_uuid()::text, '09d846b863e9961bd6c1e88e2384bf22cc422f97e6d9602bd19033ccdd5663da', now(), '20260519000000_add_primary_lead',               NULL, NULL, now(), 1),
    (gen_random_uuid()::text, 'c03176cf03e4db19199a10e32a49db8a90f0efcb72524d4980a22917e8c8f839', now(), '20260519000001_add_consultor_to_clientes',      NULL, NULL, now(), 1),
    (gen_random_uuid()::text, 'b71620fa856e3152845a9abe6606dff2a6878cde3008ed8bb7dc372c06f52b0e', now(), '20260519100000_add_ativo_usuario',              NULL, NULL, now(), 1);
