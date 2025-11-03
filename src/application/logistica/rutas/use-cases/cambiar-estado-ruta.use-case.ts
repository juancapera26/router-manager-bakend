import {Injectable, Inject} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {ruta_estado_ruta} from '@prisma/client';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';

@Injectable()
export class CambiarEstadoRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepo: RutaRepository
  ) {}

  async execute(id_ruta: number, nuevoEstado: ruta_estado_ruta) {
    const ruta = (await this.rutaRepo.findAll()).find(
      r => r.id_ruta === id_ruta
    );
    if (!ruta) throw new Error('Ruta no encontrada');

    // 🔹 Nuevo flujo reducido
    const flujoValido: Record<string, string[]> = {
      Pendiente: ['Asignada'],
      Asignada: ['Completada', 'Fallida'],
      Completada: [],
      Fallida: []
    };

    if (!flujoValido[ruta.estado_ruta].includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar de ${ruta.estado_ruta} a ${nuevoEstado}`
      );
    }

    // 🔹 Actualiza la ruta
    return this.rutaRepo.update(id_ruta, {estado_ruta: nuevoEstado});
  }
}
