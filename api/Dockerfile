# api/Dockerfile
FROM node:14

WORKDIR /app/api

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]