import {Novedad} from '../entities/novedad.entity';
import {novedades_tipo} from '@prisma/client';

export interface CrearNovedadProps {
  descripcion: string;
  tipo: novedades_tipo;
  fecha?: Date;
  id_usuario: number;
  imagen?: string | null;
  uid: string;
}

export interface NovedadRepository {
  crear(data: CrearNovedadProps): Promise<Novedad>;
  listar(): Promise<Novedad[]>;
}
