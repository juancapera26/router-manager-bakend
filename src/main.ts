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
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
