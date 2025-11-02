// application/novedades/use-cases/obtener-novedad.use-case.ts
import { Injectable } from '@nestjs/common';
import { NovedadesService } from '../../../rutas/novedades/novedades.service';

@Injectable()
export class ObtenerNovedadUseCase {
  constructor(private readonly novedadesService: NovedadesService) {}

  async execute(id: number) {
    console.log('📋 UseCase: Obteniendo novedad', id);
    const novedad = await this.novedadesService.obtenerNovedadPorId(id);
    
    return {
      id_novedad: novedad.id_novedad,
      descripcion: novedad.descripcion,
      tipo: novedad.tipo,
      fecha: new Date(novedad.fecha).toISOString(),
      imagen: novedad.imagen ?? null,
      usuario: {
        nombre: novedad.usuario?.nombre ?? '',
        apellido: novedad.usuario?.apellido ?? '',
      }
    };
  }
}