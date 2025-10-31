// src/app.module.ts
import {Module} from '@nestjs/common';

import {MailModule} from './mail/mail.module';
import {ManifestsModule} from './interface/controllers/modules/manifests.module';
import {VehiculosModule} from './interface/controllers/modules/vehiculos.module'; // ✅ NUEVO
import {UsersModule} from './interface/controllers/modules/users.module';
import {AuthModule} from './interface/controllers/modules/auth.module';
import {NovedadesModule} from './interface/controllers/modules/novedades.module';
import {ConductoresModule} from './interface/controllers/modules/conductores.module';
import {RutasModule} from './interface/controllers/modules/rutas.module';
import {PaquetesModule} from './interface/controllers/modules/paquetes.module';
import {AdministradoresModule} from './interface/controllers/modules/administradores.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    ManifestsModule,
    NovedadesModule,
    ConductoresModule,
    VehiculosModule,
    RutasModule,
    PaquetesModule,
    AdministradoresModule
  ]
})
export class AppModule {}
