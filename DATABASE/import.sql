-- ─────────────────────────────────────────────────────────────
-- ETAPA 1 — Tabela de staging (espelho exato do CSV)
-- ─────────────────────────────────────────────────────────────
-- POR QUÊ: O PostgreSQL precisa de uma tabela cujas colunas
--          batem exatamente com as do arquivo CSV para aceitar
--          o COPY. Após a importação, esta tabela é descartada.

CREATE TEMP TABLE staging_import (
    csv_lead_id           INTEGER,
    team_name             VARCHAR(200),
    user_name             VARCHAR(200),
    user_email            VARCHAR(200),
    customer_name         VARCHAR(200),
    customer_email        VARCHAR(200),
    customer_phone        VARCHAR(30),
    customer_cpf          VARCHAR(20),
    source                VARCHAR(200),
    subject               TEXT,
    lead_created_at       TIMESTAMP,
    first_interaction_at  TIMESTAMP,
    negotiation_importance VARCHAR(50),
    negotiation_stage     VARCHAR(100),
    negotiation_status    VARCHAR(100),
    is_open               BOOLEAN,
    negotiation_created_at TIMESTAMP,
    negotiation_updated_at TIMESTAMP,
    finalization_reason   TEXT
);

-- ─────────────────────────────────────────────────────────────
-- ETAPA 2 — Importar CSV para o staging
-- ─────────────────────────────────────────────────────────────
-- CORREÇÃO 6: O CSV possui BOM (Byte Order Mark) no início —
--   um marcador invisível UTF-8 (3 bytes: EF BB BF) que o
--   PostgreSQL 15 lê como parte do nome da 1ª coluna,
--   quebrando o COPY com erro "coluna não encontrada".
--
-- SOLUÇÃO: Usar PROGRAM com sed para remover o BOM antes
--   de passar o conteúdo para o COPY. O sed lê o arquivo
--   e entrega um stream limpo ao PostgreSQL.

COPY staging_import
FROM PROGRAM 'sed ''s/^\xEF\xBB\xBF//'' /tmp/dados_dashboard_ficticios.csv'
DELIMITER ','
CSV HEADER;

-- ─────────────────────────────────────────────────────────────
-- ETAPA 3 — Distribuir para as tabelas normalizadas
-- ─────────────────────────────────────────────────────────────
-- A ordem importa: tabelas sem FK vêm antes das que dependem delas.

-- 3.1 Papel padrão para consultores importados
INSERT INTO papeis (nome_papel)
VALUES ('Consultor')
ON CONFLICT (nome_papel) DO NOTHING;

-- 3.2 Loja padrão (o CSV não tem dado de loja)
--     POR QUÊ: leads.id_loja é NOT NULL, mas o CSV não tem
--     coluna de loja. Criamos uma loja genérica para não
--     bloquear a importação. Você pode ajustar depois.
INSERT INTO lojas (nome_loja)
VALUES ('Loja Padrão')
ON CONFLICT (nome_loja) DO NOTHING;

-- 3.3 Equipes
INSERT INTO equipes (nome_equipe)
SELECT DISTINCT team_name
FROM staging_import
WHERE team_name IS NOT NULL
ON CONFLICT (nome_equipe) DO NOTHING;

-- 3.4 Origens
INSERT INTO origens (nome_origem)
SELECT DISTINCT source
FROM staging_import
WHERE source IS NOT NULL
ON CONFLICT (nome_origem) DO NOTHING;

-- 3.5 Estágios
INSERT INTO estagios (nome_estagio)
SELECT DISTINCT negotiation_stage
FROM staging_import
WHERE negotiation_stage IS NOT NULL
ON CONFLICT (nome_estagio) DO NOTHING;

-- 3.6 Situações (ex-"status")
INSERT INTO situacoes (nome_situacao)
SELECT DISTINCT negotiation_status
FROM staging_import
WHERE negotiation_status IS NOT NULL
ON CONFLICT (nome_situacao) DO NOTHING;

-- 3.7 Usuários
--     DISTINCT ON evita duplicatas de e-mail vindas do CSV
--     A senha é um placeholder — nunca use isso em produção!
INSERT INTO usuarios (nome_usuario, email_usuario, senha_hash_usuario, id_papel, id_equipe)
SELECT DISTINCT ON (s.user_email)
    s.user_name,
    s.user_email,
    'IMPORTADO_TROQUE_A_SENHA',   -- hash temporário
    p.id_papel,
    e.id_equipe
FROM staging_import s
JOIN papeis  p ON p.nome_papel   = 'Consultor'
JOIN equipes e ON e.nome_equipe  = s.team_name
WHERE s.user_email IS NOT NULL
ON CONFLICT (email_usuario) DO NOTHING;

-- 3.8 Clientes
INSERT INTO clientes (nome_cliente, telefone_cliente, email_cliente, cpf_cliente)
SELECT DISTINCT ON (s.customer_email)
    s.customer_name,
    s.customer_phone,
    s.customer_email,
    s.customer_cpf
FROM staging_import s
WHERE s.customer_email IS NOT NULL
ON CONFLICT (email_cliente) DO NOTHING;

-- 3.9 Leads
--     Cada linha do CSV = 1 lead distinto
INSERT INTO leads (
    id_cliente,
    id_loja,
    id_origem,
    id_usuario,
    assunto_lead,
    data_primeira_interacao_lead,
    data_criacao_lead
)
SELECT
    c.id_cliente,
    l.id_loja,
    o.id_origem,
    u.id_usuario,
    s.subject,
    s.first_interaction_at,
    s.lead_created_at
FROM staging_import s
JOIN clientes c ON c.email_cliente = s.customer_email
JOIN lojas    l ON l.nome_loja     = 'Loja Padrão'
JOIN origens  o ON o.nome_origem   = s.source
LEFT JOIN usuarios u ON u.email_usuario = s.user_email;

-- 3.10 Negociações
--      Junta pelo par (cliente + assunto + data_criacao) para
--      identificar unicamente cada lead recém-inserido.
INSERT INTO negociacoes (
    id_lead,
    importancia_negociacao,
    estado_abertura_negociacao,
    motivo_finalizacao_negociacao,
    data_criacao_negociacao,
    data_atualizacao_negociacao,
    id_estagio,
    id_situacao
)
SELECT
    ld.id_lead,
    s.negotiation_importance,
    s.is_open,
    NULLIF(s.finalization_reason, ''),   -- converte string vazia em NULL
    s.negotiation_created_at,
    s.negotiation_updated_at,
    e.id_estagio,
    si.id_situacao
FROM staging_import s
JOIN clientes  c  ON c.email_cliente = s.customer_email
JOIN leads     ld ON ld.id_cliente   = c.id_cliente
                 AND ld.assunto_lead  = s.subject
                 AND ld.data_criacao_lead = s.lead_created_at
JOIN estagios  e  ON e.nome_estagio  = s.negotiation_stage
JOIN situacoes si ON si.nome_situacao = s.negotiation_status;

-- ─────────────────────────────────────────────────────────────
-- ETAPA 4 — Limpeza
-- ─────────────────────────────────────────────────────────────
-- A tabela temporária é descartada automaticamente ao fim da
-- sessão, mas fazemos DROP explícito por clareza.
DROP TABLE staging_import;