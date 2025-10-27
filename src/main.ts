import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as express from 'express';
import {join} from 'path';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 📁 Servir carpeta "uploads" de forma pública
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // 🌐 Habilitar CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // 📘 Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Route Manager API')
    .setDescription(
      'Documentación del backend de logística de rutas y entregas'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 🚀 Iniciar servidor
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Servidor escuchando en el puerto ${port}`);
  console.log(`📘 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
