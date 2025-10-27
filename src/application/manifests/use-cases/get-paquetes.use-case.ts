import {Injectable} from '@nestjs/common';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';
import {PrismaManifestRepository} from 'src/infrastructure/persistence/prisma/prisma-manifest.repository';

@Injectable()
export class GetPaquetesUseCase {
  constructor(private readonly manifestRepo: PrismaManifestRepository) {}

  async execute(codigo: string): Promise<Paquete[]> {
    return this.manifestRepo.getPaquetesPorManifiesto(codigo);
  }
}
