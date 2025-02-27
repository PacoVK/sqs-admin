FROM node:22-alpine AS react_builder

WORKDIR /usr/src/app

COPY . .
RUN corepack enable

RUN yarn install && yarn build

FROM golang:alpine AS golang_builder

WORKDIR /usr/src/app

COPY server .

RUN go build -o sqs-admin .

FROM alpine

WORKDIR /usr/src/app/server

COPY --from=react_builder /usr/src/app/dist /usr/src/app/public

COPY --from=golang_builder /usr/src/app/sqs-admin ./sqs-admin

ENTRYPOINT ["./sqs-admin"]