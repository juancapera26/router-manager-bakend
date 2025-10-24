// src/application/paquetes/use-cases/cambiar-estado.use-case.ts
import {Injectable, NotFoundException} from '@nestjs/common';
import {PaquetesRepository} from 'src/domain/paquetes/repositories/paquete.repository';

type Payload = {
  id_paquete: number;
  estado?: string;
  observacion_entrega?: string | null;
  imagen_entrega_path?: string | null;
  fecha_entrega?: Date | null;
};

@Injectable()
export class CambiarEstadoPaqueteUseCase {
  constructor(private readonly paqueteRepo: PaquetesRepository) {}

  async execute(payload: Payload) {
    const paquete = await this.paqueteRepo.findById(payload.id_paquete);
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    const updateData: any = {};

    if (payload.estado) updateData.estado_paquete = payload.estado;
    if (payload.observacion_entrega !== undefined)
      updateData.observacion_entrega = payload.observacion_entrega;
    if (payload.imagen_entrega_path !== undefined)
      updateData.imagen_entrega = payload.imagen_entrega_path;
    if (payload.fecha_entrega) updateData.fecha_entrega = payload.fecha_entrega;

    const updated = await this.paqueteRepo.update(
      paquete.id_paquete,
      updateData
    );
    return updated;
  }
}
