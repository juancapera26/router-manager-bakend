// src/application/logistica/rutas/use-case/create-ruta.use-case.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CreateRutaDto } from '../../../../interface/controllers/dto/rutas/create-ruta.dto';
import { RutaRepository } from '../../../../domain/logistica/rutas/repositories/ruta.repository';
import { RUTA_REPOSITORY_TOKEN } from '../../../../domain/logistica/rutas/tokens/ruta-repository.token'

@Injectable()
export class CreateRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepository: RutaRepository,
  ) {}
 
  async execute(createRutaDto: CreateRutaDto) {
    try {
      // Validar que la fecha de inicio no sea anterior a hoy
      const fechaInicio = new Date(createRutaDto.fecha_inicio);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaInicio < hoy) {
        throw new BadRequestException(
          'La fecha de inicio no puede ser anterior a la fecha actual'
        );
      }

      // Validar fecha de fin si se proporciona
      if (createRutaDto.fecha_fin) {
        const fechaFin = new Date(createRutaDto.fecha_fin);
        if (fechaFin <= fechaInicio) {
          throw new BadRequestException(
            'La fecha de fin debe ser posterior a la fecha de inicio'
          );
        }
      }

      // Validar que conductor existe y está disponible (si se proporciona)
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

      // Validar que vehículo existe y está disponible (si se proporciona)
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

      // Crear la ruta
      const nuevaRuta = await this.rutaRepository.create({
        estado_ruta: 'Pendiente', // Siempre inicia como Pendiente
        fecha_inicio: fechaInicio,
        fecha_fin: createRutaDto.fecha_fin ? new Date(createRutaDto.fecha_fin) : null,
        id_conductor: createRutaDto.id_conductor || null,
        id_vehiculo: createRutaDto.id_vehiculo || null,
        cod_manifiesto: null, // Se genera cuando se asigna conductor
      });

      return {
        success: true,
        message: 'Ruta creada exitosamente',
        data: nuevaRuta,
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(
        `Error al crear la ruta: ${error.message}`
      );
    }
  }
}