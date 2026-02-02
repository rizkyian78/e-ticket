# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# 👇 build-time args
ARG VITE_API_TICKET_SERVICE_URL
ARG VITE_API_PAYMENT_SERVICE_URL
ARG VITE_API_KEY

# 👇 expose to Vite
ENV VITE_API_TICKET_SERVICE_URL=$VITE_API_TICKET_SERVICE_URL
ENV VITE_API_PAYMENT_SERVICE_URL=$VITE_API_PAYMENT_SERVICE_URL
ENV VITE_API_KEY=$VITE_API_KEY

RUN yarn build


# =========================
# Runtime stage
# =========================
FROM node:20-alpine

WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
