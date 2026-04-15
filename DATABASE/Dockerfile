# Utiliza a imagem oficial do PostgreSQL (versão baseada em Alpine para ser mais leve)
FROM postgres:15-alpine

# Define as variáveis de ambiente padrão para a criação inicial da base de dados
# Em produção, estes valores devem ser passados pelo docker-compose.yml ou ficheiro .env
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123
ENV POSTGRES_DB=abp_leads

# Copia o script SQL com DDL (tabelas) e DML (cargas iniciais de papéis/roles e admin)
# O PostgreSQL executa automaticamente qualquer ficheiro na pasta /docker-entrypoint-initdb.d/ 
# na primeira vez que a base de dados é construída.
COPY ./db.sql /docker-entrypoint-initdb.d/

# Expõe a porta padrão do PostgreSQL para que o backend consiga conectar-se
EXPOSE 5432