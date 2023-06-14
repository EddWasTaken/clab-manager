FROM node:18.16.0-bullseye-slim

WORKDIR /server

COPY ./package.json ./package.json
COPY ./index.js ./index.js
COPY ./root-path.js ./root-path.js

COPY ./controllers ./controllers
COPY ./models ./models
COPY ./routes ./routes

RUN mkdir /topos

RUN npm install

COPY . .

EXPOSE 80
CMD ["npm", "start"]