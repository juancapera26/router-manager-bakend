import {Module} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {UpdateConductorUseCase} from 'src/application/conductores/use-cases/update-conductor.use-case';
import {PrismaConductorRepository} from 'src/infrastructure/persistence/prisma/prisma-conductor.repository';
import {ConductoresController} from '../conductores.controller';
import {ConductorRepositoryToken} from 'src/domain/conductores/tokens/conductor-repository.token';
import {GetAllConductoresUseCase} from 'src/application/conductores/use-cases/get-all-conductores.use-case';
import {DeleteConductorUseCase} from 'src/application/conductores/use-cases/delete-conductor.use-case';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module'; // 👈 IMPORTANTE
import {CambiarEstadoConductorUseCase} from 'src/application/conductores/use-cases/cambiar-estado-conductor.use-case';

@Module({
  imports: [InfrastructureModule], // 👈 Necesario para acceder a FirebaseAuthProvider
  controllers: [ConductoresController],
  providers: [
    PrismaService,
    UpdateConductorUseCase,
    DeleteConductorUseCase,
    GetAllConductoresUseCase,
    CambiarEstadoConductorUseCase, // <-- AGREGADO
    {
      provide: ConductorRepositoryToken,
      useClass: PrismaConductorRepository
    }
  ],
  exports: [
    UpdateConductorUseCase,
    CambiarEstadoConductorUseCase // <-- ahora sí se puede exportar
  ]
})
export class ConductoresModule {}
