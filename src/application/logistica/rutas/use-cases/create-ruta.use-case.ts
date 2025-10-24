// src/application/logistica/rutas/use-cases/crear-ruta.use-case.ts
import {Injectable, Inject} from '@nestjs/common';
import {
  RutaRepository,
  CreateRutaData,
  RutaEntity
} from 'src/domain/logistica/rutas/repositories/ruta.repository';

@Injectable()
export class CreateRutaUseCase {
  constructor(
    @Inject('RutaRepository') private readonly rutaRepo: RutaRepository
  ) {}

  async execute(data: CreateRutaData): Promise<RutaEntity> {
    return this.rutaRepo.create(data);
  }
}
