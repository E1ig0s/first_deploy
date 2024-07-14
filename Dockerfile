FROM node:20

WORKDIR /server/

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000 3306

CMD ["yarn", "start:dev"]