// src/application/logistica/rutas/use-cases/cambiar-estado-ruta.use-case.ts
import {Injectable} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {ruta_estado_ruta} from '@prisma/client';

@Injectable()
export class CambiarEstadoRutaUseCase {
  constructor(private readonly rutaRepo: RutaRepository) {}

  async execute(id_ruta: number, nuevoEstado: ruta_estado_ruta) {
    return this.rutaRepo.update(id_ruta, {estado_ruta: nuevoEstado});
  }
}
