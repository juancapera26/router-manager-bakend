import {Module} from '@nestjs/common';
import {PrismaModule} from 'prisma/prisma.module';
import {CrearNovedadUseCase} from 'src/application/novedades/use-cases/crear-novedad.use-case';
import {ListarNovedadesUseCase} from 'src/application/novedades/use-cases/listar-novedades.use-case';
import {NovedadRepositoryToken} from 'src/domain/novedades/tokens/novedad-repository.token';
import {PrismaNovedadRepository} from 'src/infrastructure/persistence/prisma/prisma-novedad.repository';
import {NovedadesController} from '../novedades.controller';
import {PrismaService} from 'prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [NovedadesController],
  providers: [
    CrearNovedadUseCase,
    ListarNovedadesUseCase,
    {
      provide: NovedadRepositoryToken,
      useFactory: (prisma: PrismaService) =>
        new PrismaNovedadRepository(prisma),
      inject: [PrismaService]
    }
  ],
  exports: [] // si otro módulo necesita el repositorio, agrégalo aquí
})
export class NovedadesModule {}
