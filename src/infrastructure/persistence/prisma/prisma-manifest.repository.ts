import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';
import Decimal from 'decimal.js';

@Injectable()
export class PrismaManifestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPaquetesPorManifiesto(codigo: string): Promise<Paquete[]> {
    const paquetes = await this.prisma.paquete.findMany({
      where: {
        ruta: {cod_manifiesto: codigo}
      },
      select: {
        codigo_rastreo: true,
        direccion: true,
        largo: true,
        ancho: true,
        alto: true,
        peso: true,
        estado_paquete: true,
        tipo_paquete: true,
        lat: true,
        lng: true
      }
    });

    // Convertir Decimal a number
    return paquetes.map(
      p =>
        new Paquete({
          ...p,
          lat: p.lat ? (p.lat as Decimal).toNumber() : undefined,
          lng: p.lng ? (p.lng as Decimal).toNumber() : undefined
        })
    );
  }
}
