// src/app.module.ts
import {Module} from '@nestjs/common';

import {MailModule} from './mail/mail.module';
import {ManifestsModule} from './interface/controllers/modules/manifests.module';
import {PaquetesModule} from './interface/controllers/modules/paquetes.module';
import {VehiculosModule} from './interface/controllers/modules/vehiculos.module'; // ✅ NUEVO
import { UsersModule } from './interface/controllers/modules/users.module';
import { AuthModule } from './interface/controllers/modules/auth.module';
import { NovedadesModule } from './interface/controllers/modules/novedades.module';
import { ConductoresModule } from './interface/controllers/modules/conductores.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    ManifestsModule,
    NovedadesModule,
    ConductoresModule,
    VehiculosModule,
    PaquetesModule,
  ]
})
export class AppModule {}