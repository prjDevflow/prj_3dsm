# Utiliza a imagem oficial do PostgreSQL baseada em Alpine
FROM postgres:15-alpine

# 1. Copia o DDL e DML base (criação de tabelas e chaves)
# Renomeamos virtualmente para 01-db.sql para garantir que seja executado primeiro
COPY ./db.sql /docker-entrypoint-initdb.d/01-db.sql

# 2. Copia o arquivo CSV para um diretório temporário dentro do contêiner
COPY ./dados_dashboard_ficticios.csv /tmp/dados_dashboard_ficticios.csv

# 3. Copia um novo script (que criaremos a seguir) responsável apenas pela importação
# O prefixo 02- garante que ele rode APÓS as tabelas serem criadas
COPY ./import.sql /docker-entrypoint-initdb.d/02-import.sql

EXPOSE 5432