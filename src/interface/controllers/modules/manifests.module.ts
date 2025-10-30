import {Module} from '@nestjs/common';
import {ManifestsController} from '../manifests.controller';
import {GetPaquetesUseCase} from 'src/application/manifests/use-cases/get-paquetes.use-case';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';
import {PrismaRutaRepository} from 'src/infrastructure/persistence/prisma/prisma-ruta.repository';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';

@Module({
  imports: [InfrastructureModule],
  controllers: [ManifestsController],
  providers: [
    GetPaquetesUseCase,
    {
      provide: RUTA_REPOSITORY_TOKEN, // <-- token de la interfaz
      useClass: PrismaRutaRepository // <-- clase concreta que implementa la interfaz
    }
  ]
})
export class ManifestsModule {}
