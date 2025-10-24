import {Module} from '@nestjs/common';
import {PrismaRutaRepository} from 'src/infrastructure/persistence/prisma/prisma-ruta.repository';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {GetAllRutasUseCase} from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';
import {CambiarEstadoRutaUseCase} from 'src/application/logistica/rutas/use-cases/cambiar-estado-ruta.use-case';
import {CreateRutaUseCase} from 'src/application/logistica/rutas/use-cases/create-ruta.use-case';
import {DeleteRutaUseCase} from 'src/application/logistica/rutas/use-cases/eliminar-ruta.use-case';
import {RutasController} from '../rutas.controller';

@Module({
  controllers: [RutasController],
  providers: [
    PrismaService,
    {
      provide: 'RutaRepository', // 🔹 clave de la interfaz
      useClass: PrismaRutaRepository // 🔹 implementación concreta
    },
    GetAllRutasUseCase,
    CambiarEstadoRutaUseCase,
    CreateRutaUseCase,
    DeleteRutaUseCase
  ]
})
export class RutasModule {}
