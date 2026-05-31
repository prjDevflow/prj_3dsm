ALTER TABLE "papeis" ADD COLUMN IF NOT EXISTS "descricao"    VARCHAR(200);
ALTER TABLE "papeis" ADD COLUMN IF NOT EXISTS "cor"          VARCHAR(20)  DEFAULT '#17364F';
ALTER TABLE "papeis" ADD COLUMN IF NOT EXISTS "editavel"     BOOLEAN      DEFAULT true;
ALTER TABLE "papeis" ADD COLUMN IF NOT EXISTS "capabilities" JSONB        DEFAULT '{}';
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "permissoes_extras" JSONB DEFAULT '{}';

UPDATE papeis SET editavel = false WHERE nome_papel IN ('ADMIN','GERENTE_GERAL','GERENTE','ATENDENTE');

UPDATE papeis SET descricao = 'Acesso total ao sistema, incluindo logs e configurações'   WHERE nome_papel = 'ADMIN';
UPDATE papeis SET descricao = 'Visão consolidada de todas as equipes e relatórios'         WHERE nome_papel = 'GERENTE_GERAL';
UPDATE papeis SET descricao = 'Gestão de leads e atendentes de uma equipe'                 WHERE nome_papel = 'GERENTE';
UPDATE papeis SET descricao = 'Atendimento e gestão de leads próprios'                     WHERE nome_papel = 'ATENDENTE';

UPDATE papeis SET cor = '#7C3AED' WHERE nome_papel = 'ADMIN';
UPDATE papeis SET cor = '#4F46E5' WHERE nome_papel = 'GERENTE_GERAL';
UPDATE papeis SET cor = '#2563EB' WHERE nome_papel = 'GERENTE';
UPDATE papeis SET cor = '#64748B' WHERE nome_papel = 'ATENDENTE';

UPDATE papeis SET capabilities = '{"pages":{"dashboard":true,"leads":true,"clients":true,"logs":true,"admin":true,"settings":true,"users":true,"teams":true},"actions":{"export_csv":true,"import_csv":true,"create_lead":true,"delete_lead":true,"view_all_leads":true,"create_user":true,"delete_user":true}}'  WHERE nome_papel = 'ADMIN';
UPDATE papeis SET capabilities = '{"pages":{"dashboard":true,"leads":true,"clients":true,"logs":true,"admin":false,"settings":true,"users":false,"teams":true},"actions":{"export_csv":true,"import_csv":true,"create_lead":true,"delete_lead":false,"view_all_leads":true,"create_user":false,"delete_user":false}}' WHERE nome_papel = 'GERENTE_GERAL';
UPDATE papeis SET capabilities = '{"pages":{"dashboard":true,"leads":true,"clients":true,"logs":false,"admin":false,"settings":false,"users":false,"teams":true},"actions":{"export_csv":true,"import_csv":true,"create_lead":true,"delete_lead":false,"view_all_leads":false,"create_user":false,"delete_user":false}}' WHERE nome_papel = 'GERENTE';
UPDATE papeis SET capabilities = '{"pages":{"dashboard":true,"leads":true,"clients":true,"logs":false,"admin":false,"settings":false,"users":false,"teams":false},"actions":{"export_csv":true,"import_csv":false,"create_lead":true,"delete_lead":false,"view_all_leads":false,"create_user":false,"delete_user":false}}' WHERE nome_papel = 'ATENDENTE';
