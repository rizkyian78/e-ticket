# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build

# =========================
# Runtime stage (serve)
# =========================
FROM node:20-alpine

WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# -s : SPA fallback
# -l : listen port
CMD ["serve", "-s", "dist", "-l", "3000"]
