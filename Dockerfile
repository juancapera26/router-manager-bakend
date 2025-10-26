# Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar lockfile y package.json
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .
RUN npm run build

# Final
FROM node:20-alpine
WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]
