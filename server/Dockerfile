FROM golang:1.21-alpine AS builder

WORKDIR /cvwo-assignment/server

COPY go.mod go.sum main.go ./

COPY . .

RUN go build -o main

FROM golang:1.21-alpine

WORKDIR /app

COPY --from=builder /cvwo-assignment/server/main .

CMD ["./main"]

EXPOSE 8080