# Builder
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN yarn build

# Final
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
# No seteamos PORT, Cloud Run lo pasa automáticamente
EXPOSE 8080

# Librerías necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copiar solo lo necesario del builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./prisma

CMD ["node", "-r", "module-alias/register", "dist/main.js"]
