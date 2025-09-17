import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';

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
        lat: true, // 👈 incluir
        lng: true // 👈 incluir
      }
    });

    return paquetes.map(
      p =>
        new Paquete({
          codigo_rastreo: p.codigo_rastreo,
          direccion: p.direccion,
          largo: p.largo,
          ancho: p.ancho,
          alto: p.alto,
          peso: p.peso,
          estado_paquete: p.estado_paquete,
          tipo_paquete: p.tipo_paquete,
          lat: p.lat ? Number(p.lat) : undefined,
          lng: p.lng ? Number(p.lng) : undefined
        })
    );
  }
}
