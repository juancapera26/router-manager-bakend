// src/domain/paquetes/repositories/paquetes.repository.ts

import {Paquetes} from '../entities/paquetes.entity';

export interface PaquetesRepository {
  findById(id: number): Promise<Paquetes | null>;
  update(id: number, data: Partial<Paquetes>): Promise<Paquetes>;
  cambiarEstado(
    id: number,
    estado: string,
    observacion?: string | null,
    imagen_entrega?: string | null,
    fecha_entrega?: Date | null
  ): Promise<Paquetes>;
}
