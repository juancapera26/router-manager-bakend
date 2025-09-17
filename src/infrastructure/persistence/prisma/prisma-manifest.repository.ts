import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';

@Injectable()
export class PrismaManifestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPaquetesPorManifiesto(codigo: string): Promise<Paquete[]> {
    const paquetes = await this.prisma.paquete.findMany({
      where: {
        ruta: {
          cod_manifiesto: codigo // busca paquetes cuya ruta tiene ese código de manifiesto
        }
      },
      select: {
        codigo_rastreo: true,
        direccion: true,
        largo: true,
        ancho: true,
        alto: true,
        peso: true,
        estado_paquete: true,
        tipo_paquete: true
      }
    });

    return paquetes as Paquete[];
  }
}
