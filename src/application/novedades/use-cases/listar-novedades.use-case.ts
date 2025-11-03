// application/novedades/use-cases/listar-novedades.use-case.ts
import { Injectable } from '@nestjs/common';
import { NovedadesService } from '../../../rutas/novedades/novedades.service';

export interface NovedadFrontend {
  id_novedad: number;
  descripcion: string;
  tipo: string;
  fecha: string;
  imagen: string | null;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

@Injectable()
export class ListarNovedadesUseCase {
  constructor(
    private readonly novedadesService: NovedadesService
  ) {}

  async execute(): Promise<NovedadFrontend[]> {
    console.log('📋 UseCase: Ejecutando listarNovedades');
    const novedades = await this.novedadesService.listarNovedades();
    console.log('📋 UseCase: Novedades recibidas:', novedades.length);

    // Mapea las novedades al formato esperado por el frontend
    return novedades.map(n => ({
      id_novedad: n.id_novedad,
      descripcion: n.descripcion,
      tipo: n.tipo,
      fecha: new Date(n.fecha).toISOString(),
      imagen: n.imagen ?? null,
      usuario: {
        nombre: n.usuario?.nombre ?? '',
        apellido: n.usuario?.apellido ?? '',
      }
    }));
  }
}