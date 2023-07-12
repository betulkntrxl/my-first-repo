FROM node:18-buster

WORKDIR /usr/src/app

COPY ./certs ./certs

COPY ./build ./build

COPY ./server ./server

USER node

CMD ["node", "server/server.js"]
