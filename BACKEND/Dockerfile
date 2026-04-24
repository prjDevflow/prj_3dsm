# Usa uma imagem base oficial do Node.js (versão LTS Alpine para ser mais leve)
FROM node:20-alpine

# ADICIONADO: Instala o OpenSSL, requisito fundamental para o Prisma rodar no Alpine
RUN apk add --no-cache openssl

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (otimização de cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências do projeto
RUN npm install

# Gera o cliente do Prisma (necessário para o ORM funcionar corretamente)
RUN npx prisma generate

# Copia todo o restante do código do backend para o contêiner
COPY . .

# Compila o código TypeScript para JavaScript (gera a pasta dist/)
RUN npm run build

# Expõe a porta que a API utilizará
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]