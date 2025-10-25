# Copiar archivos de dependencias y carpeta prisma
COPY package*.json ./
COPY prisma ./prisma

# Instalar dependencias
RUN npm install

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build

# Establecer puerto
ENV PORT=8080
EXPOSE 8080

# Comando producción
CMD ["npm", "run", "start:prod"]
