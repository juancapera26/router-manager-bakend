// application/novedades/use-cases/eliminar-novedad.use-case.ts
import { Injectable } from '@nestjs/common';
import { NovedadesService } from '../../../rutas/novedades/novedades.service';

// Eliminar novedad

@Injectable()
export class EliminarNovedadUseCase {
  constructor(private readonly novedadesService: NovedadesService) {}

  async execute(id: number) {
    console.log('📋 UseCase: Eliminando novedad', id);
    return await this.novedadesService.eliminarNovedad(id);
  }
}