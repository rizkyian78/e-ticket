# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


# =========================
# Runtime stage
# =========================
FROM node:20-alpine

WORKDIR /app

# lightweight static server
RUN yarn global add serve

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
