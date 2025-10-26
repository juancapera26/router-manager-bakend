# Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Habilitar Corepack para Yarn (viene con Node 20)
RUN corepack enable

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar cliente Prisma (si usas Prisma)
RUN npx prisma generate

# Compilar TypeScript
RUN yarn build

# Final
FROM node:20-alpine
WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]
