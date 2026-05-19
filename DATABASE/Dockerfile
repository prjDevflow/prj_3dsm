FROM postgres:15

RUN apt-get update && apt-get install -y locales --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i pt_BR -c -f UTF-8 \
       -A /usr/share/locale/locale.alias pt_BR.UTF-8

ENV LANG=pt_BR.UTF-8
ENV LC_ALL=pt_BR.UTF-8

# CSV disponível para o script de importação
COPY dados_dashboard_ficticios.csv /tmp/dados_dashboard_ficticios.csv

# Scripts executados automaticamente na primeira inicialização (ordem alfabética)
# 01 – cria o schema (idêntico ao que o Prisma criaria via migrations)
# 02 – registra as migrations no _prisma_migrations para o backend não recriar tabelas
# 03 – importa os dados do CSV para as tabelas do sistema
COPY 01_schema.sql      /docker-entrypoint-initdb.d/01_schema.sql
COPY 02_mark_migrations.sql /docker-entrypoint-initdb.d/02_mark_migrations.sql
COPY 03_import_csv.sql  /docker-entrypoint-initdb.d/03_import_csv.sql
