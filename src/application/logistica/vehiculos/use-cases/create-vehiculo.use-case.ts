// src/application/logistics/vehiculos/use-cases/create-vehiculo.use-case.ts
import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { VehiculoRepository } from '../../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { VEHICULO_REPOSITORY_TOKEN } from '../../../../domain/logistica/vehiculos/tokens/vehiculo-repository.token';
import { VehiculoDomainEntity } from '../../../../domain/logistica/vehiculos/entities/vehiculo.entity';
import { vehiculo_tipo, vehiculo_estado_vehiculo } from '@prisma/client';

interface CreateVehiculoInput {
  placa: string;
  tipo: vehiculo_tipo;
  estado_vehiculo?: vehiculo_estado_vehiculo;
}

@Injectable()
export class CreateVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepository: VehiculoRepository,
  ) {}

  async execute(input: CreateVehiculoInput) {
    try {
      // Verificar si la placa ya existe
      const placaExiste = await this.vehiculoRepository.existsByPlaca(input.placa);
      if (placaExiste) {
        throw new ConflictException(`La placa ${input.placa} ya está registrada`);
      }

      // Crear entidad de dominio (validaciones incluidas)
      const vehiculoDomain = VehiculoDomainEntity.crear(
        input.placa,
        input.tipo,
        input.estado_vehiculo
      );

      // Persistir en el repositorio
      const vehiculoCreado = await this.vehiculoRepository.create({
        placa: vehiculoDomain.placa,
        tipo: vehiculoDomain.tipo,
        estado_vehiculo: vehiculoDomain.estado_vehiculo,
      });

      return {
        success: true,
        message: 'Vehículo creado exitosamente',
        data: vehiculoCreado,
      };
    } catch (error) {
      if (error instanceof Error && !error.message.includes('prisma')) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Error al crear el vehículo: ${error.message}`);
    }
  }
}