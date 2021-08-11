FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

RUN mkdir /app/src
RUN mkdir /app/ssl

COPY package.json /app
RUN npm install

COPY .env /app
COPY server.js /app

EXPOSE 3000

CMD [ "node", "server.js" ]