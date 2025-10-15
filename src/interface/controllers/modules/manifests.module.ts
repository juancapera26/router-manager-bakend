import {Module} from '@nestjs/common';
import {ManifestsController} from '../manifests.controller';
import {GetPaquetesUseCase} from 'src/application/manifests/use-cases/get-paquetes.use-case';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [ManifestsController],
  providers: [GetPaquetesUseCase]
})
export class ManifestsModule {}
