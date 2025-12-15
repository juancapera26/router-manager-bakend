import {Module} from '@nestjs/common';
import {PrismaModule} from 'prisma/prisma.module';
import {CrearNovedadUseCase} from 'src/application/novedades/use-cases/crear-novedad.use-case';
import {ListarNovedadesUseCase} from 'src/application/novedades/use-cases/listar-novedades.use-case';
import {NovedadRepositoryToken} from 'src/domain/novedades/tokens/novedad-repository.token';
import {PrismaNovedadRepository} from 'src/infrastructure/persistence/prisma/prisma-novedad.repository';
import {NovedadesController} from '../novedades.controller';
import {PrismaService} from 'prisma/prisma.service';
import {NovedadesService} from 'src/rutas/novedades/novedades.service';
import {ObtenerNovedadUseCase} from 'src/application/novedades/use-cases/obtener-novedades.use-case';
import {EliminarNovedadUseCase} from 'src/application/novedades/use-cases/eliminar-novedad.use-case';
import { NotificationsModule } from './notifications.module';

// Módulo de novedades

@Module({
  imports: [PrismaModule,NotificationsModule],
  controllers: [NovedadesController],
  providers: [
    NovedadesService,
    ObtenerNovedadUseCase,
    EliminarNovedadUseCase,
    CrearNovedadUseCase,
    ListarNovedadesUseCase,
    PrismaService,
    {
      provide: NovedadRepositoryToken,
      useFactory: (prisma: PrismaService) =>
        new PrismaNovedadRepository(prisma),
      inject: [PrismaService]
    }
  ],
  exports: []
})
export class NovedadesModule {}
