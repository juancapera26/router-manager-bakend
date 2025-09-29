import {Module} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {UpdateConductorUseCase} from 'src/application/conductores/use-cases/update-conductor.use-case';
import {PrismaConductorRepository} from 'src/infrastructure/persistence/prisma/prisma-conductor.repository';
import {ConductoresController} from '../conductores.controller';
import {ConductorRepositoryToken} from 'src/domain/conductores/tokens/conductor-repository.token';

@Module({
  controllers: [ConductoresController],
  providers: [
    PrismaService,
    UpdateConductorUseCase,
    {
      provide: ConductorRepositoryToken,
      useClass: PrismaConductorRepository
    }
  ],
  exports: [UpdateConductorUseCase]
})
export class ConductoresModule {}
