import {Ubicacion} from '../entities/ubicacion.entity';

export interface UbicacionRepository {
  crear(
    ubicacion: Omit<Ubicacion, 'id_ubicacion' | 'fecha_registro'>
  ): Promise<Ubicacion>;

  crearOActualizar(
    ubicacion: Omit<Ubicacion, 'id_ubicacion' | 'fecha_registro'>
  ): Promise<Ubicacion>;

  obtenerPorRuta(id_ruta: number): Promise<Ubicacion[]>;
}
