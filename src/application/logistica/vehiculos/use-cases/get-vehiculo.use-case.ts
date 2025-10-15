// src/application/logistics/vehiculos/use-cases/get-vehiculo.use-case.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';

@Injectable()
export class GetVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute(id: number) {
    const vehiculo = await this.vehiculoRepository.findById(id);
    
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }

    return vehiculo;
  }
}