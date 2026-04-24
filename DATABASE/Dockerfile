# Usa a imagem oficial do PostgreSQL (versão compatível com o seu docker-compose)
FROM postgres:15-alpine

# Define o idioma padrão do banco para suportar acentuação (pt_BR)
ENV LANG pt_BR.utf8

# Copia os arquivos DDL e DML para o diretório de inicialização do PostgreSQL.
# O PostgreSQL executa automaticamente scripts .sql encontrados nesta pasta na primeira vez que sobe.
# IMPORTANTE: A ordem de execução é alfabética. Por isso, nomeamos com prefixos numéricos.
COPY db.sql /docker-entrypoint-initdb.d/01_db.sql
COPY import.sql /docker-entrypoint-initdb.d/02_import.sql