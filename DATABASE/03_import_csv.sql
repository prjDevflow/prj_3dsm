-- Importação do CSV para o schema do Prisma.
-- Os status e estágios do CSV são mapeados para os valores padrão do sistema.

-- ── Staging ──────────────────────────────────────────────────────────────────
CREATE TEMP TABLE staging (
    csv_lead_id            INTEGER,
    team_name              VARCHAR(200),
    user_name              VARCHAR(200),
    user_email             VARCHAR(200),
    customer_name          VARCHAR(200),
    customer_email         VARCHAR(200),
    customer_phone         VARCHAR(30),
    customer_cpf           VARCHAR(20),
    source                 VARCHAR(200),
    subject                TEXT,
    lead_created_at        TIMESTAMP,
    first_interaction_at   TIMESTAMP,
    negotiation_importance VARCHAR(50),
    negotiation_stage      VARCHAR(100),
    negotiation_status     VARCHAR(100),
    is_open                BOOLEAN,
    negotiation_created_at TIMESTAMP,
    negotiation_updated_at TIMESTAMP,
    finalization_reason    TEXT
);

COPY staging
FROM PROGRAM 'sed ''s/^\xEF\xBB\xBF//'' /tmp/dados_dashboard_ficticios.csv'
DELIMITER ',' CSV HEADER;

-- ── Dados de referência ───────────────────────────────────────────────────────
-- Papel padrão para consultores do CSV
INSERT INTO papeis (id_papel, nome_papel)
VALUES (gen_random_uuid(), 'ATENDENTE')
ON CONFLICT (nome_papel) DO NOTHING;

-- Loja padrão para leads do CSV (o CSV não tem coluna de loja)
INSERT INTO lojas (id_loja, nome_loja)
VALUES (gen_random_uuid(), 'Loja Padrão CSV')
ON CONFLICT DO NOTHING;

-- Equipes do CSV
INSERT INTO equipes (id_equipe, nome_equipe)
SELECT gen_random_uuid(), team_name
FROM staging
WHERE team_name IS NOT NULL
GROUP BY team_name
ON CONFLICT DO NOTHING;

-- Origens do CSV (trunca em 50 chars para caber no VARCHAR(50))
INSERT INTO origens (id_origem, nome_origem)
SELECT gen_random_uuid(), LEFT(source, 50)
FROM staging
WHERE source IS NOT NULL
GROUP BY LEFT(source, 50)
ON CONFLICT (nome_origem) DO NOTHING;

-- Mapeamento de status do CSV → padrão do sistema
INSERT INTO status (id_status, nome_status) VALUES
    (gen_random_uuid(), 'ABERTA'),
    (gen_random_uuid(), 'GANHA'),
    (gen_random_uuid(), 'PERDIDA'),
    (gen_random_uuid(), 'CANCELADA')
ON CONFLICT (nome_status) DO NOTHING;

-- Mapeamento de estágios do CSV → padrão do sistema
INSERT INTO estagios (id_estagio, nome_estagio) VALUES
    (gen_random_uuid(), 'primeiro_contato'),
    (gen_random_uuid(), 'qualificacao'),
    (gen_random_uuid(), 'proposta_enviada'),
    (gen_random_uuid(), 'negociacao'),
    (gen_random_uuid(), 'fechamento')
ON CONFLICT (nome_estagio) DO NOTHING;

-- ── Usuários (consultores do CSV) ─────────────────────────────────────────────
INSERT INTO usuarios (id_usuario, nome_usuario, email_usuario, senha_hash_usuario, id_papel, id_equipe)
SELECT DISTINCT ON (s.user_email)
    gen_random_uuid(),
    s.user_name,
    s.user_email,
    'IMPORTADO_SEM_ACESSO',
    p.id_papel,
    e.id_equipe
FROM staging s
JOIN papeis  p ON p.nome_papel  = 'ATENDENTE'
JOIN equipes e ON e.nome_equipe = s.team_name
WHERE s.user_email IS NOT NULL
ON CONFLICT (email_usuario) DO NOTHING;

-- ── Clientes ─────────────────────────────────────────────────────────────────
INSERT INTO clientes (id_cliente, nome_cliente, telefone_cliente, email_cliente)
SELECT DISTINCT ON (s.customer_email)
    gen_random_uuid(),
    s.customer_name,
    s.customer_phone,
    s.customer_email
FROM staging s
WHERE s.customer_email IS NOT NULL
ON CONFLICT (email_cliente) DO NOTHING;

-- ── Leads ─────────────────────────────────────────────────────────────────────
INSERT INTO leads (id_lead, id_cliente, id_usuario, id_loja, id_origem, data_criacao_lead)
SELECT
    gen_random_uuid(),
    c.id_cliente,
    u.id_usuario,
    l.id_loja,
    o.id_origem,
    s.lead_created_at
FROM staging s
JOIN clientes c ON c.email_cliente = s.customer_email
JOIN usuarios u ON u.email_usuario  = s.user_email
JOIN lojas    l ON l.nome_loja      = 'Loja Padrão CSV'
JOIN origens  o ON o.nome_origem    = LEFT(s.source, 50);

-- ── Negociações ──────────────────────────────────────────────────────────────
-- Mapeia os valores do CSV para os status e estágios padrão do sistema
INSERT INTO negociacoes (
    id_negociacao,
    id_lead,
    importancia_negociacao,
    estado_abertura_negociacao,
    motivo_finalizacao_negociacao,
    data_criacao_negociacao,
    id_estagio,
    id_status
)
SELECT
    gen_random_uuid(),
    ld.id_lead,
    s.negotiation_importance,
    s.is_open,
    NULLIF(s.finalization_reason, ''),
    s.negotiation_created_at,
    -- Mapeamento de estágios CSV → sistema
    est.id_estagio,
    -- Mapeamento de status CSV → sistema
    st.id_status
FROM staging s
JOIN clientes c  ON c.email_cliente = s.customer_email
JOIN leads    ld ON ld.id_cliente   = c.id_cliente
                AND ld.data_criacao_lead = s.lead_created_at
JOIN estagios est ON est.nome_estagio = CASE s.negotiation_stage
    WHEN 'Contato inicial'                 THEN 'primeiro_contato'
    WHEN 'Aguardando resposta do cliente'  THEN 'qualificacao'
    WHEN 'Enviou proposta'                 THEN 'proposta_enviada'
    WHEN 'Teste drive'                     THEN 'negociacao'
    WHEN 'Aguardando pagamento'            THEN 'fechamento'
    ELSE 'primeiro_contato'
END
JOIN status st ON st.nome_status = CASE s.negotiation_status
    WHEN 'Aberto'               THEN 'ABERTA'
    WHEN 'Em negociação'        THEN 'ABERTA'
    WHEN 'Finalizado com venda' THEN 'GANHA'
    WHEN 'Finalizado sem venda' THEN 'PERDIDA'
    ELSE 'ABERTA'
END;

DROP TABLE staging;
