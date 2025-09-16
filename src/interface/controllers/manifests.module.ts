// src/interface/controllers/manifests.module.ts
import {Module} from '@nestjs/common';
import {ManifestsController} from './manifests.controller';
import {GetPaquetesUseCase} from 'src/application/manifests/use-cases/get-paquetes.use-case';
import {GeocodingService} from 'src/application/manifests/services/geocoding.service';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [ManifestsController], // << agregar aquí
  providers: [GetPaquetesUseCase, GeocodingService] // << agregar el servicio
})
export class ManifestsModule {}
