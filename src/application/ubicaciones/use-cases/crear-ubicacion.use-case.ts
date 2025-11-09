import {Inject, Injectable} from '@nestjs/common';
import {UBICACION_REPOSITORY} from '../../../domain/ubicaciones/tokens/ubicacion-repository.token';
import {UbicacionRepository} from '../../../domain/ubicaciones/repositories/ubicacion.repository';
import {Ubicacion} from '../../../domain/ubicaciones/entities/ubicacion.entity';

@Injectable()
export class CrearUbicacionUseCase {
  constructor(
    @Inject(UBICACION_REPOSITORY)
    private readonly ubicacionRepository: UbicacionRepository
  ) {}

  // Crear o actualizar ubicación
  async execute(id_ruta: number, lat: number, lng: number): Promise<Ubicacion> {
    return this.ubicacionRepository.crearOActualizar({id_ruta, lat, lng});
  }

  // Traer todas las ubicaciones de una ruta
  getUbicaciones(id_ruta: number): Promise<Ubicacion[]> {
    return this.ubicacionRepository.obtenerPorRuta(id_ruta);
  }
}
