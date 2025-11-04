import {Module} from '@nestjs/common';
import {PrismaRutaRepository} from 'src/infrastructure/persistence/prisma/prisma-ruta.repository';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {GetAllRutasUseCase} from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';
import {CambiarEstadoRutaUseCase} from 'src/application/logistica/rutas/use-cases/cambiar-estado-ruta.use-case';
import {CreateRutaUseCase} from 'src/application/logistica/rutas/use-cases/create-ruta.use-case';
import {RutasController} from '../rutas.controller';
import {ConductoresModule} from './conductores.module';
import {AsignarConductorUseCase} from 'src/application/logistica/rutas/use-cases/asignar-conductor.use-case';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';
import {EliminarRutaUseCase} from 'src/application/logistica/rutas/use-cases/eliminar-ruta.use-case';
//Nuevas importaciones
import {AsignarVehiculoUseCase} from 'src/application/logistica/rutas/use-cases/asignar-vehiculo.use-case';
import {VehiculosModule} from './vehiculos.module';

@Module({
  imports: [ConductoresModule, VehiculosModule],
  controllers: [RutasController],
  providers: [
    PrismaService,
    {
      provide: RUTA_REPOSITORY_TOKEN, // 🔹 clave de la interfaz
      useClass: PrismaRutaRepository // 🔹 implementación concreta
    },
    GetAllRutasUseCase,
    CambiarEstadoRutaUseCase,
    CreateRutaUseCase,
    EliminarRutaUseCase,
    AsignarConductorUseCase,
    AsignarVehiculoUseCase
  ]
})
export class RutasModule {}
