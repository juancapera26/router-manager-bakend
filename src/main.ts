import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {Logger} from '@nestjs/common';
import {join} from 'path';

async function bootstrap() {
  try {
    Logger.log('🚀 Iniciando aplicación...', 'Bootstrap');

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose']
    });

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/'
    });

    // Habilitar CORS
    app.enableCors({
      origin: true,
      credentials: true
    });

    const port = parseInt(process.env.PORT || '8080', 10);
    const env = process.env.NODE_ENV || 'development';

    Logger.log(`📌 NODE_ENV = ${env}`, 'Bootstrap');
    Logger.log(`📌 PORT = ${port}`, 'Bootstrap');
    Logger.log(`📌 Servidor escuchando en 0.0.0.0:${port}`, 'Bootstrap');

    await app.listen(port, '0.0.0.0');

    Logger.log(
      `✅ Aplicación iniciada correctamente en http://0.0.0.0:${port}`,
      'Bootstrap'
    );
  } catch (error) {
    Logger.error('❌ Error al iniciar el servidor:', error);
    console.error('Error completo:', error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  Logger.error('❌ Error fatal en bootstrap:', err);
  console.error('Error completo:', err);
  process.exit(1);
});
