// src/app.module.ts
import {Module} from '@nestjs/common';
import {UsersModule} from './interface/controllers/modules/users.module';
import {AuthModule} from './interface/controllers/modules/auth.module';
import {MailModule} from './mail/mail.module';
import {ManifestsModule} from './interface/controllers/modules/manifests.module';
import {PaquetesModule} from './interface/controllers/modules/paquetes.module';
import {NovedadesModule} from './interface/controllers/modules/novedades.module';
import {ConductoresModule} from './interface/controllers/modules/conductores.module';
// import {CategoriasModule} from './pruebasapi/categorias/categorias.module';
// import {PedidosModule} from './pruebasapi/pedidos/pedidos.module';
// import {ProductosModule} from './pruebasapi/productos/productos.module';
// import {UsuariosModule} from './pruebasapi/usuarios/usuarios.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    PaquetesModule,
    ManifestsModule,
    NovedadesModule,
    ConductoresModule
    // UsuariosModule,
    // ProductosModule,
    // PedidosModule,
    // CategoriasModule
  ]
})
export class AppModule {}
