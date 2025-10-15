// src/application/logistics/vehiculos/use-cases/delete-vehiculo.use-case.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';

@Injectable()
export class DeleteVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute(id: number) {
    try {
      // Verificar que el vehículo existe
      const vehiculo = await this.vehiculoRepository.findById(id);
      if (!vehiculo) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }

      // Eliminar el vehículo
      const eliminado = await this.vehiculoRepository.delete(id);

      if (!eliminado) {
        throw new BadRequestException('No se pudo eliminar el vehículo');
      }

      return {
        success: true,
        message: 'Vehículo eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Error al eliminar el vehículo: ${error.message}`);
    }
  }
}