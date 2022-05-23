FROM node:18-alpine AS REACT_BUILDER

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

FROM golang:alpine AS GOLANG_BUILDER

WORKDIR /usr/src/app

COPY server .

RUN go build -o sqs-admin .

FROM alpine

WORKDIR /usr/src/app/server

COPY --from=REACT_BUILDER /usr/src/app/public /usr/src/app/public

COPY --from=GOLANG_BUILDER /usr/src/app/sqs-admin ./sqs-admin

ENTRYPOINT ["./sqs-admin"]