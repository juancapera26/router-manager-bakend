// src/app.module.ts
import {Module} from '@nestjs/common';
import {UsersModule} from './interface/controllers/modules/users.module';
import {AuthModule} from './interface/controllers/modules/auth.module';
import {UsersModule} from './interface/controllers/modules/users.module';
import {AuthModule} from './interface/controllers/modules/auth.module';
import {MailModule} from './mail/mail.module';
import {ManifestsModule} from './interface/controllers/modules/manifests.module';
import {PaquetesModule} from './interface/controllers/modules/paquetes.module';
import {NovedadesModule} from './interface/controllers/modules/nes.module';
import {ConductoresModule} from './interface/controllers/modules/conductores.moduleovedad';
import {VehiculosModule} from './interface/controllers/modules/vehiculos.module'; // ✅ NUEVO

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    PaquetesModule,
    ManifestsModule,
    NovedadesModule,
    ConductoresModule,
    VehiculosModule, // ✅ AGREGADO
  ]
})
export class AppModule {}