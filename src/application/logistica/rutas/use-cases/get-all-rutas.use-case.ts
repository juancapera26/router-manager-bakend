// src/application/logistica/rutas/use-cases/get-all-rutas.use-case.ts
import {Injectable, Inject} from '@nestjs/common';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';

@Injectable()
export class GetAllRutasUseCase {
  constructor(
    @Inject('RutaRepository') private readonly rutaRepository: RutaRepository
  ) {}

  async execute() {
    return this.rutaRepository.findAll();
  }
}
