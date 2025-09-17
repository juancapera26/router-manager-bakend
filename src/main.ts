import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as express from 'express';
import {join} from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 📂 Servir carpeta "uploads"
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));

  // 🔓 Configurar CORS
  app.enableCors({
    origin: [
      'https://route-manager.vercel.app', // Producción
      'http://localhost:5174' // Desarrollo local
    ],
    credentials: true // 👈 Si usas cookies, sesiones o headers personalizados
  });

  await app.listen(3000);
}
bootstrap();
