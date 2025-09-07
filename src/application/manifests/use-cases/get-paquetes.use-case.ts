import {Injectable} from '@nestjs/common';
import {PrismaManifestRepository} from 'src/infrastructure/persistence/prisma/prisma-manifest.repository';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';

@Injectable()
export class GetPaquetesUseCase {
  constructor(private readonly manifestRepo: PrismaManifestRepository) {}

  async execute(codigo: string): Promise<Paquete[]> {
    return this.manifestRepo.getPaquetesPorManifiesto(codigo);
  }
}
