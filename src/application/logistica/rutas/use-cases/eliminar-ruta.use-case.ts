// src/application/logistica/rutas/use-cases/eliminar-ruta.use-case.ts
import {Injectable, Inject} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';

@Injectable()
export class DeleteRutaUseCase {
  constructor(
    @Inject('RutaRepository') private readonly rutaRepo: RutaRepository
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.rutaRepo.delete(id);
  }
}
