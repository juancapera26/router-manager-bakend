// src/application/logistica/rutas/use-cases/eliminar-ruta.use-case.ts
import {Injectable, Inject} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';

@Injectable()
export class EliminarRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN) // 🔹 usar el Symbol, no un string
    private readonly rutaRepo: RutaRepository
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.rutaRepo.delete(id);
  }
}
