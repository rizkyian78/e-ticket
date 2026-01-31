# ---------- build stage ----------
    FROM golang:1.25-alpine AS builder

    WORKDIR /app
    
    COPY go.mod go.sum ./
    RUN go mod download
    
    COPY . .
    
    # build target selected via ARG
    ARG CMD_NAME
    RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -o app ./cmd/${CMD_NAME}
    
    # ---------- runtime stage ----------
    FROM gcr.io/distroless/base-debian12
    
    WORKDIR /app
    
    COPY --from=builder /app/app .
    
    USER nonroot:nonroot
    
    CMD ["/app/app"]
    