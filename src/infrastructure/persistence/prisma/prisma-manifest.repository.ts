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
        id_paquete: true,
        codigo_rastreo: true,
        fecha_registro: true,
        fecha_entrega: true,
        estado_paquete: true,
        largo: true,
        ancho: true,
        alto: true,
        peso: true,
        id_cliente: true,
        id_ruta: true,
        id_barrio: true,
        direccion_entrega: true,
        tipo_paquete: true,
        lat: true,
        lng: true,
        valor_declarado: true,
        cantidad: true
      }
    });

    return paquetes.map(
      p =>
        new Paquete({
          id_paquete: p.id_paquete,
          codigo_rastreo: p.codigo_rastreo,
          fecha_registro: p.fecha_registro,
          fecha_entrega: p.fecha_entrega,
          estado_paquete: p.estado_paquete,
          largo: p.largo,
          ancho: p.ancho,
          alto: p.alto,
          peso: p.peso,
          id_cliente: p.id_cliente,
          id_ruta: p.id_ruta,
          id_barrio: p.id_barrio,
          direccion: p.direccion_entrega, // 👈 lo mantienes como "direccion" en tu entity
          tipo_paquete: p.tipo_paquete,
          lat: p.lat ? Number(p.lat) : undefined,
          lng: p.lng ? Number(p.lng) : undefined,
          valor_declarado: p.valor_declarado,
          cantidad: p.cantidad
        })
    );
  }
}
