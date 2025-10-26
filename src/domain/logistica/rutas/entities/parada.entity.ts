// src/domain/paquetes/repositories/paquete.repository.ts

import {Paquete} from 'src/domain/manifests/entities/paquete.entity';

export interface PaqueteRepository {
  /**
   * Encuentra un paquete por su ID.
   */
  findById(id: number): Promise<Paquete | null>;

  /**
   * Actualiza un paquete con los datos dados.
   * Solo cambia los campos proporcionados.
   */
  update(id: number, data: Partial<Paquete>): Promise<Paquete>;

  /**
   * Cambia el estado del paquete (ej. Entregado, Fallido, etc.)
   */
  cambiarEstado(
    id: number,
    estado: string,
    observacion?: string | null,
    imagen_entrega?: string | null,
    fecha_entrega?: Date | null
  ): Promise<Paquete>;
}
