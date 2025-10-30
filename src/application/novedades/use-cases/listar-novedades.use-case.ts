import {Inject, Injectable} from '@nestjs/common';
import {NovedadRepositoryToken} from '../../../domain/novedades/tokens/novedad-repository.token';
import {NovedadRepository} from '../../../domain/novedades/repositories/novedad.repository';

export interface NovedadFrontend {
  id_novedad: number;
  descripcion: string;
  tipo: string;
  fecha: string;
  imagen: string | null;
  usuario: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

@Injectable()
export class ListarNovedadesUseCase {
  constructor(
    @Inject(NovedadRepositoryToken)
    private readonly novedadesRepo: NovedadRepository
  ) {}

  async execute(): Promise<NovedadFrontend[]> {
    const novedades = await this.novedadesRepo.listar(); // Aquí novedades es Novedad[]

    // Mapea propiedades correctamente
    return novedades.map(n => ({
      id_novedad: (n as any).id ?? 0, // Si tu entidad tiene `id` en vez de `id_novedad`
      descripcion: n.descripcion ?? '',
      tipo: n.tipo ?? 'otro',
      fecha: n.fecha
        ? new Date(n.fecha).toISOString()
        : new Date().toISOString(),
      imagen: n.imagen ?? null,
      usuario: {
        nombre: (n as any).usuario?.nombre ?? '', // Asegúrate que el repo traiga usuario
        apellido: (n as any).usuario?.apellido ?? '',
        correo: (n as any).usuario?.correo ?? ''
      }
    }));
  }
}
