FROM node:16-buster

WORKDIR /usr/src/app

COPY ./build ./build

COPY ./server ./server

USER node

CMD ["node", "server/server.js"]
