// src/application/logistics/vehiculos/use-cases/update-estado-vehiculo.use-case.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';
import { VehiculoDomainEntity } from '../../../../domain/logistica/vehiculos/entities/vehiculo.entity';

@Injectable()
export class UpdateEstadoVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute(id: number, disponible: boolean) {
    try {
      // Verificar que el vehículo existe
      const vehiculoExistente = await this.vehiculoRepository.findById(id);
      if (!vehiculoExistente) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }

      // Crear entidad de dominio
      const vehiculoDomain = new VehiculoDomainEntity(
        vehiculoExistente.id_vehiculo,
        vehiculoExistente.placa,
        vehiculoExistente.tipo,
        vehiculoExistente.estado_vehiculo
      );

      // Cambiar estado usando lógica de dominio
      vehiculoDomain.cambiarEstado(disponible);

      // Persistir cambios
      const vehiculoActualizado = await this.vehiculoRepository.update(id, {
        estado_vehiculo: vehiculoDomain.estado_vehiculo,
      });

      return {
        success: true,
        message: `Vehículo marcado como ${disponible ? 'disponible' : 'no disponible'} exitosamente`,
        data: vehiculoActualizado,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Error al cambiar estado del vehículo: ${error.message}`);
    }
  }
}