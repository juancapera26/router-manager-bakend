import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para tu frontend en Vite (localhost:5173)
  app.enableCors({
    origin: ['http://localhost:5173', 'https://route-manager.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
