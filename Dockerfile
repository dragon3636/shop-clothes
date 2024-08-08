FROM node:22-alpine

WORKDIR /base-api

COPY . .
RUN yarn