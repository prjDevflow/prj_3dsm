CREATE TABLE IF NOT EXISTS "permissoes_sistema" (
  "id_permissao" UUID        NOT NULL DEFAULT gen_random_uuid(),
  "chave"        VARCHAR(100) NOT NULL,
  "nome"         VARCHAR(200) NOT NULL,
  "descricao"    TEXT,
  "categoria"    VARCHAR(50)  NOT NULL,
  "ativa"        BOOLEAN      NOT NULL DEFAULT true,
  CONSTRAINT "permissoes_sistema_pkey"  PRIMARY KEY ("id_permissao"),
  CONSTRAINT "permissoes_sistema_chave" UNIQUE ("chave")
);

INSERT INTO permissoes_sistema (chave, nome, descricao, categoria) VALUES
  ('dashboard',      'Ver Dashboard',          'Acesso ao painel de métricas e gráficos',          'pages'),
  ('leads',          'Ver Leads',              'Acesso à lista e gestão de leads',                 'pages'),
  ('clients',        'Ver Clientes',           'Acesso à base de clientes',                        'pages'),
  ('teams',          'Ver Equipes',            'Acesso ao gerenciamento de equipes',               'pages'),
  ('settings',       'Ver Configurações',      'Acesso às configurações do sistema',               'pages'),
  ('logs',           'Ver Logs de Auditoria',  'Acesso ao histórico completo de operações',        'pages'),
  ('admin',          'Painel Administrativo',  'Acesso ao painel de perfis e permissões',          'pages'),
  ('users',          'Gerenciar Usuários',     'Acesso à gestão de usuários do sistema',           'pages'),
  ('create_lead',    'Criar Leads',            'Pode registrar novos leads no sistema',            'actions'),
  ('delete_lead',    'Excluir Leads',          'Pode remover leads permanentemente',               'actions'),
  ('view_all_leads', 'Ver Leads de Todos',     'Visualiza leads de todos os atendentes',           'actions'),
  ('export_csv',     'Exportar Dados',         'Pode exportar leads em formato XLS',              'actions'),
  ('import_csv',     'Importar Leads (CSV)',   'Pode fazer upload de leads em massa via CSV',     'actions'),
  ('create_user',    'Criar Usuários',         'Pode cadastrar novos usuários no sistema',        'actions'),
  ('delete_user',    'Excluir Usuários',       'Pode remover usuários do sistema',                'actions')
ON CONFLICT (chave) DO NOTHING;
