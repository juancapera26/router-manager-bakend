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

      // 🔹 Flujo permitido de estados
    const flujoValido: Record<string, string[]> = {
      Pendiente: ['Asignada'],
      Asignada: ['Completada', 'Fallida'],
      En_ruta: ['Completada', 'Fallida'],
      Completada: [],
      Fallida: []
    };

    // 🔹 Normalizar valores por si vienen con espacios u otros formatos
    const estadoActual = ruta.estado_ruta.trim();
    const nuevo = String(nuevoEstado).trim();

    console.log('🪶 DEBUG cambio de estado:', {
      actual: estadoActual,
      nuevo,
      permitidos: flujoValido[estadoActual]
    });

    // 🔹 Validar transición
    if (!flujoValido[estadoActual]?.includes(nuevo)) {
      throw new Error(`No se puede cambiar de ${estadoActual} a ${nuevo}`);
    }

    // 🔹 Actualizar estado de la ruta
    return this.rutaRepo.update(id_ruta, {estado_ruta: nuevoEstado});
  }
}
