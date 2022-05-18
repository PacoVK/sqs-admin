FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

FROM node:18-alpine

WORKDIR /usr/src/app

RUN yarn global add serve

COPY --from=BUILD_IMAGE /usr/src/app/build ./build

RUN yarn install --production \
    && yarn autoclean --force

EXPOSE 3000

CMD ["serve", "-s", "build"]
