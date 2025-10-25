# Usa la imagen base de Node.js
FROM node:18-alpine

# Crea el directorio de la app
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expón el puerto (Cloud Run usa 8080)
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]
