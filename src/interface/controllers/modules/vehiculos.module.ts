// src/interface/controllers/modules/vehiculos.module.ts
import {Module} from '@nestjs/common';
import {PrismaService} from '../../../infrastructure/persistence/prisma/prisma.service';
import {VehiculosController} from '../vehiculos.controller';
import {VEHICULO_REPOSITORY_TOKEN} from '../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';
import {PrismaVehiculoRepository} from '../../../infrastructure/persistence/prisma/prisma-vehiculo.repository';

// Casos de uso
import {GetAllVehiculosUseCase} from '../../../application/logistica/vehiculos/use-cases/get-all-vehiculos.use-case';
import {GetVehiculoUseCase} from '../../../application/logistica/vehiculos/use-cases/get-vehiculo.use-case';
import {CreateVehiculoUseCase} from '../../../application/logistica/vehiculos/use-cases/create-vehiculo.use-case';
import {UpdateVehiculoUseCase} from '../../../application/logistica/vehiculos/use-cases/update-vehiculo.use-case';
import {DeleteVehiculoUseCase} from '../../../application/logistica/vehiculos/use-cases/delete-vehiculo.use-case';
import {UpdateEstadoVehiculoUseCase} from '../../../application/logistica/vehiculos/use-cases/update-estado-vehiculo.use-case';

@Module({
  controllers: [VehiculosController],
  providers: [
    PrismaService,

    // Repositorio
    {
      provide: VEHICULO_REPOSITORY_TOKEN,
      useClass: PrismaVehiculoRepository
    },

    // Casos de uso
    GetAllVehiculosUseCase,
    GetVehiculoUseCase,
    CreateVehiculoUseCase,
    UpdateVehiculoUseCase,
    DeleteVehiculoUseCase,
    UpdateEstadoVehiculoUseCase
  ],
  exports: [
    VEHICULO_REPOSITORY_TOKEN,
    GetAllVehiculosUseCase,
    GetVehiculoUseCase
  ]
})
export class VehiculosModule {}
