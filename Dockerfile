# Usa Node 20 (requerido por NestJS 11 y Firebase)
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build

# Establecer variable de entorno
ENV PORT=8080

# Exponer el puerto 8080 para Cloud Run
EXPOSE 8080

# Comando para iniciar NestJS
CMD ["npm", "run", "start:prod"]
