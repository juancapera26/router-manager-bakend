import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para local y producción
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
