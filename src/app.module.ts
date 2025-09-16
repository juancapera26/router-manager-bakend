// src/app.module.ts
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {MailModule} from './mail/mail.module';
import {ManifestsModule} from './interface/controllers/manifests.module';
import {NovedadesModule} from './novedades/novedades.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // << esto permite leer variables de entorno
    UsersModule,
    AuthModule,
    MailModule,
    ManifestsModule,
    NovedadesModule // Añade NovedadesModule aquí
  ]
})
export class AppModule {}
