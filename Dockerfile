# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Generar el cliente Prisma y compilar NestJS
RUN npx prisma generate
RUN npm run build


# Etapa 2: Ejecución
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario para ejecutar
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/main.js"]
