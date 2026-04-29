FROM postgres:15


RUN apt-get update && apt-get install -y locales --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i pt_BR -c -f UTF-8 \
       -A /usr/share/locale/locale.alias pt_BR.UTF-8

ENV LANG=pt_BR.UTF-8
ENV LC_ALL=pt_BR.UTF-8

COPY dados_dashboard_ficticios.csv /tmp/dados_dashboard_ficticios.csv

COPY db.sql    /docker-entrypoint-initdb.d/01_db.sql
COPY import.sql /docker-entrypoint-initdb.d/02_import.sql