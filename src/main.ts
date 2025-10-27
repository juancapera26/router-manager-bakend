import 'module-alias/register';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
// import * as express from 'express';
// import {join} from 'path';
// import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
// import * as admin from 'firebase-admin';
// import {PrismaClient} from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor escuchando en el puerto ${port}`);
}

bootstrap();
