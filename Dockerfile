FROM --platform=linux/amd64 node:18.19.0-bullseye-slim

WORKDIR /usr/src/app

COPY ./certs ./certs

COPY ./build ./build

COPY ./server ./server

USER node

CMD ["node", "server/server.js"]
