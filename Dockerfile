FROM golang:latest as build-backend
ENV GO111MODULE=on
ADD . /go/src/github.com/uploadexpress/app/
WORKDIR /go/src/github.com/uploadexpress/app/
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o main ./cmd/server/main.go

FROM node:latest as build-frontend
WORKDIR /usr/src/app
COPY www/package.json www/yarn.lock ./
RUN yarn
COPY ./www ./
RUN yarn build

FROM alpine:latest
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
WORKDIR /app
COPY --from=build-backend /go/src/github.com/uploadexpress/app/main .
COPY --from=build-frontend /usr/src/app/build ./front
EXPOSE 4000
RUN chmod +x ./main
CMD ["./main"]

