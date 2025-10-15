// src/application/logistics/vehiculos/use-cases/update-vehiculo.use-case.ts
import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';
import { VehiculoDomainEntity } from '../../../../domain/logistica/vehiculos/entities/vehiculo.entity';
import { vehiculo_tipo } from '@prisma/client';

interface UpdateVehiculoInput {
  placa?: string;
  tipo?: vehiculo_tipo;
}

@Injectable()
export class UpdateVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute(id: number, input: UpdateVehiculoInput) {
    try {
      // Verificar que el vehículo existe
      const vehiculoExistente = await this.vehiculoRepository.findById(id);
      if (!vehiculoExistente) {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }

      // Crear entidad de dominio con los datos actuales
      const vehiculoDomain = new VehiculoDomainEntity(
        vehiculoExistente.id_vehiculo,
        vehiculoExistente.placa,
        vehiculoExistente.tipo,
        vehiculoExistente.estado_vehiculo
      );

      // Aplicar cambios con validaciones de dominio
      if (input.placa) {
        // Verificar si la nueva placa ya existe (excluyendo el vehículo actual)
        const placaExiste = await this.vehiculoRepository.existsByPlaca(input.placa, id);
        if (placaExiste) {
          throw new ConflictException(`La placa ${input.placa} ya está registrada`);
        }
        vehiculoDomain.actualizarPlaca(input.placa);
      }

      if (input.tipo) {
        vehiculoDomain.actualizarTipo(input.tipo);
      }

      // Persistir cambios
      const vehiculoActualizado = await this.vehiculoRepository.update(id, {
        placa: vehiculoDomain.placa,
        tipo: vehiculoDomain.tipo,
      });

      return {
        success: true,
        message: 'Vehículo actualizado exitosamente',
        data: vehiculoActualizado,
      };
    } catch (error) {
      if (error instanceof Error && !error.message.includes('prisma')) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Error al actualizar el vehículo: ${error.message}`);
    }
  }
}