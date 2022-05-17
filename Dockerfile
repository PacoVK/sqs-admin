FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

FROM node:18-alpine

WORKDIR /usr/src/app

RUN yarn global add serve

COPY --from=BUILD_IMAGE /usr/src/app/build ./build
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 5000

CMD ["serve", "-s", "build"]
