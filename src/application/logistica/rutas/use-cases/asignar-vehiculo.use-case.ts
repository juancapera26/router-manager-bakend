// src/application/logistica/rutas/use-cases/asignar-vehiculo.use-case.ts
import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';
import {VehiculoRepository} from 'src/domain/logistica/vehiculos/repositories/vehiculo.repository';
import {VEHICULO_REPOSITORY_TOKEN} from 'src/domain/logistica/vehiculos/tokens/vehiculo-repository.token';

// DTO
export class AsignarVehiculoDto {
  id_vehiculo: number;
}

@Injectable()
export class AsignarVehiculoUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepo: RutaRepository,
    @Inject(VEHICULO_REPOSITORY_TOKEN)
    private readonly vehiculoRepo: VehiculoRepository
  ) {}

  async execute(idRuta: number, idVehiculo: number) {
    // 1️⃣ Verificar que la ruta existe
    const ruta = await this.rutaRepo.findById(idRuta);
    if (!ruta) {
      throw new BadRequestException(`Ruta con ID ${idRuta} no encontrada`);
    }

    // 2️⃣ Verificar que la ruta está en estado Pendiente
    if (ruta.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        `La ruta debe estar en estado Pendiente. Estado actual: ${ruta.estado_ruta}`
      );
    }

    // 3️⃣ Verificar que el vehículo existe
    const vehiculo = await this.vehiculoRepo.findById(idVehiculo);
    if (!vehiculo) {
      throw new BadRequestException(`Vehículo con ID ${idVehiculo} no encontrado`);
    }

    // 4️⃣ Verificar que el vehículo está disponible
    if (vehiculo.estado_vehiculo !== 'Disponible') {
      throw new BadRequestException(
        `El vehículo con placa ${vehiculo.placa} no está disponible`
      );
    }

    // 5️⃣ Asignar el vehículo a la ruta
    const rutaActualizada = await this.rutaRepo.update(idRuta, {
      id_vehiculo: idVehiculo
    });

    // 6️⃣ Marcar el vehículo como No_disponible
    const vehiculoActualizado = await this.vehiculoRepo.update(idVehiculo, {
      estado_vehiculo: 'No_disponible'
    });

    return {
      ruta: rutaActualizada,
      vehiculo: vehiculoActualizado
    };
  }
}