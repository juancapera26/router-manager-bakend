// src/application/logistics/vehiculos/use-cases/get-all-vehiculos.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';

@Injectable()
export class GetAllVehiculosUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute() {
    return await this.vehiculoRepository.findAll();
  }
}