import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  // 👇 Ajustar DATABASE_URL dinámicamente
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL_PROD) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_PROD;
  }

  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para local y producción
  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend local (Vite)
      'https://route-manager.vercel.app' // Deploy en Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  // ✅ usar puerto dinámico para prod o 3000 en local
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
