# Utiliza a imagem oficial do Node.js (versão leve)
FROM node:20-alpine

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia os ficheiros de dependências primeiro
COPY package*.json ./

# Instala as dependências do React
RUN npm install --legacy-peer-deps

# Copia o restante do código do frontend
COPY . .

# Expõe a porta padrão do Vite (ajusta se a tua configuração do Vite for diferente)
EXPOSE 5173

# Inicia o servidor de desenvolvimento do frontend
CMD ["npm", "run", "dev", "--", "--host"]