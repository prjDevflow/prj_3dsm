-- Script de importação (02-import.sql)

-- O comando COPY lê o arquivo que jogamos na pasta /tmp/ pelo Dockerfile
-- e insere diretamente na tabela especificada.

COPY nome_da_tabela (coluna1, coluna2, coluna3) 
FROM '/tmp/dados_dashboard_ficticios.csv' 
DELIMITER ',' 
CSV HEADER;

-- Exemplo se fosse importar direto para a tabela de leads (ignorando chaves estrangeiras complexas para fins de exemplo):
-- COPY leads (id_cliente, id_loja, id_origem, id_usuario, data_criacao_lead) 
-- FROM '/tmp/dados_dashboard_ficticios.csv' DELIMITER ';' CSV HEADER;