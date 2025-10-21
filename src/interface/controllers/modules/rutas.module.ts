import {Module} from '@nestjs/common';
import {PrismaRutaRepository} from 'src/infrastructure/persistence/prisma/prisma-ruta.repository';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {GetAllRutasUseCase} from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';
import {RutasController} from '../rutas.controller';

@Module({
  controllers: [RutasController],
  providers: [PrismaService, PrismaRutaRepository, GetAllRutasUseCase]
})
export class RutasModule {}
