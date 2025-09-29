// src/application/logistica/rutas/use-case/create-ruta.use-case.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CreateRutaDto } from '../../../../interface/controllers/dto/rutas/create-ruta.dto';
import { RutaRepository } from '../../../../domain/logistica/rutas/repositories/ruta.repository';
import { RUTA_REPOSITORY_TOKEN } from '../../../../domain/logistica/rutas/tokens/ruta-repository.token';
import { RutaDomainEntity } from '../../../../domain/logistica/rutas/entities/ruta.entity';
import { RutaDomainMapper } from '../../../../domain/logistica/rutas/mappers/ruta-domain.mapper';

@Injectable()
export class CreateRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepository: RutaRepository,
  ) {}
 
  async execute(createRutaDto: CreateRutaDto) {
    try {
      const fechaInicio = new Date(createRutaDto.fecha_inicio);
      const fechaFin = createRutaDto.fecha_fin ? new Date(createRutaDto.fecha_fin) : null;

      // Validar disponibilidad de recursos (si vienen) - CAPA DE INFRAESTRUCTURA
      if (createRutaDto.id_conductor) {
        const conductorDisponible = await this.rutaRepository.isConductorDisponible(
          createRutaDto.id_conductor
        );
        if (!conductorDisponible) {
          throw new BadRequestException(
            'El conductor no está disponible o no existe'
          );
        }
      }

      if (createRutaDto.id_vehiculo) {
        const vehiculoDisponible = await this.rutaRepository.isVehiculoDisponible(
          createRutaDto.id_vehiculo
        );
        if (!vehiculoDisponible) {
          throw new BadRequestException(
            'El vehículo no está disponible o no existe'
          );
        }
      }

      // CREAR ENTIDAD DE DOMINIO - Todas las validaciones de negocio están aquí
      const rutaDomainEntity = RutaDomainEntity.crear(
        fechaInicio,
        fechaFin,
        createRutaDto.id_conductor || null,
        createRutaDto.id_vehiculo || null
      );

      // MAPEAR a datos de persistencia
      const createRutaData = RutaDomainMapper.toCreateData(rutaDomainEntity);

      // PERSISTIR
      const rutaCreada = await this.rutaRepository.create(createRutaData);

      return {
        success: true,
        message: 'Ruta creada exitosamente',
        data: rutaCreada,
      };

    } catch (error) {
      // Los errores de dominio vienen como Error estándar
      if (error instanceof Error && !error.message.includes('prisma')) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(
        `Error al crear la ruta: ${error.message}`
      );
    }
  }
}