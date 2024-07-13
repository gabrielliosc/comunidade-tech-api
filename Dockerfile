#Imagem do node utilizada para o desenvolvimento
FROM node:18-alpine as development

#Diretório de trabalho
WORKDIR /usr/src/app

#Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json .

#Instala as dependências
RUN npm install

#Copia o resto dos arquivos
COPY . .

#Executa o comando npm run knex -- migrate:latest para criar as tabelas no banco de dados
RUN npm run knex -- migrate:latest

#Executa o comando de build para gerando o arquivo server.js
RUN npm run build

#Imagem do node utilizada para a produção
FROM node:18-alpine as production

#Variável de ambiente
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

#Diretório de trabalho
WORKDIR /usr/src/app

#Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json .

#Instala as dependências só da produção
RUN npm ci --only=production

#Copia o build gerado na imagem de desenvolvimento
COPY --from=development /usr/src/app/build ./build

#Expõe a porta 3333
EXPOSE 3333

#Executa o comando node build/server.js para iniciar a aplicação
CMD ["node", "build/server.js"]