import {Injectable, Inject} from '@nestjs/common';
import {
  RutaRepository,
  CreateRutaData,
  RutaEntity
} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';

@Injectable()
export class CreateRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN) // 🔹 usar el símbolo
    private readonly rutaRepo: RutaRepository
  ) {}

  async execute(data: CreateRutaData): Promise<RutaEntity> {
    return this.rutaRepo.create(data);
  }
}
