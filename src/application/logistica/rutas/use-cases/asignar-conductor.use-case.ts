import {Injectable, Inject} from '@nestjs/common';
import {CambiarEstadoConductorUseCase} from 'src/application/conductores/use-cases/cambiar-estado-conductor.use-case';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';
import {ruta_estado_ruta} from '@prisma/client';

@Injectable()
export class AsignarConductorUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepo: RutaRepository,
    private readonly cambiarEstadoConductorUseCase: CambiarEstadoConductorUseCase
  ) {}

  async execute(idRuta: number, idConductor: number) {
    // 1️⃣ Actualiza la ruta asignando el conductor y cambiando su estado
    const rutaActualizada = await this.rutaRepo.update(idRuta, {
      id_conductor: idConductor,
      estado_ruta: 'Asignada' as ruta_estado_ruta
    });

    // 2️⃣ Cambia el estado del conductor a "En ruta"
    const conductorActualizado =
      await this.cambiarEstadoConductorUseCase.execute(idConductor, 'En ruta');

    // 3️⃣ Devuelve ambos para la respuesta
    return {
      ruta: rutaActualizada,
      conductor: conductorActualizado
    };
  }
}
