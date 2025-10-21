import {Injectable} from '@nestjs/common';
import {PrismaRutaRepository} from 'src/infrastructure/persistence/prisma/prisma-ruta.repository';

@Injectable()
export class GetAllRutasUseCase {
  constructor(private readonly rutaRepository: PrismaRutaRepository) {}

  async execute() {
    return this.rutaRepository.getAllRutas();
  }
}
