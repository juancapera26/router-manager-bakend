import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module'; // 👈 importa PrismaModule
import {CrearUbicacionUseCase} from 'src/application/ubicaciones/use-cases/crear-ubicacion.use-case';
import {PrismaUbicacionRepository} from 'src/infrastructure/persistence/prisma/prisma-ubicacion.repository';
import {UBICACION_REPOSITORY} from 'src/domain/ubicaciones/tokens/ubicacion-repository.token';
import {UbicacionesController} from '../ubicaciones.controller';

@Module({
  imports: [PrismaModule], // 👈 agrega esta línea
  controllers: [UbicacionesController],
  providers: [
    CrearUbicacionUseCase,
    {provide: UBICACION_REPOSITORY, useClass: PrismaUbicacionRepository}
  ]
})
export class UbicacionesModule {}
