# Usa uma imagem base oficial do Node.js (versão LTS Alpine para ser mais leve)
FROM node:20-alpine

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

# Expõe a porta que a API utilizará (Importante para o Swagger e Integração)
# Confirme a porta definida no seu server.ts ou .env (ex: 3333)
EXPOSE 3333

# Comando para iniciar a aplicação (ajuste conforme o script no seu package.json)
CMD ["npm", "run", "start"]