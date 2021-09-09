FROM node:14-alpine AS building

WORKDIR /app/patente

COPY ./*.json ./
COPY ./src ./src

RUN yarn

CMD yarn start:dev
