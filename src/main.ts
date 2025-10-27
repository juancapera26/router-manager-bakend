import 'module-alias/register';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8080;
  const env = process.env.NODE_ENV || 'development';

  Logger.log(`NODE_ENV = ${env}`, 'Bootstrap');
  Logger.log(`process.env.PORT = ${process.env.PORT}`, 'Bootstrap');
  Logger.log(`Servidor escuchando en el puerto ${port}`, 'Bootstrap');

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch(err => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
