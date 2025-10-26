# Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar lockfile y package.json primero para cache
COPY package*.json ./
RUN npm ci

# Copiar Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar resto del código y build
COPY . .
RUN npm run build

# Final
FROM node:20-alpine
WORKDIR /app

# Copiar solo lo necesario para producción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]
