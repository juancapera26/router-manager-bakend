import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {PaquetesRepository} from 'src/domain/paquetes/repositories/paquete.repository';
import {Paquetes} from 'src/domain/paquetes/entities/paquetes.entity';
import {paquete_estado_paquete} from '@prisma/client'; // ✅ Enum Prisma

@Injectable()
export class PrismaPaqueteRepository implements PaquetesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaToDomain(prismaObj: any): Paquetes {
    return {
      id_paquete: prismaObj.id_paquete,
      codigo_rastreo: prismaObj.codigo_rastreo,
      fecha_registro: prismaObj.fecha_registro,
      fecha_entrega: prismaObj.fecha_entrega,
      estado_paquete: prismaObj.estado_paquete,
      largo: prismaObj.largo,
      ancho: prismaObj.ancho,
      alto: prismaObj.alto,
      peso: prismaObj.peso,
      id_cliente: prismaObj.id_cliente,
      id_ruta: prismaObj.id_ruta,
      id_barrio: prismaObj.id_barrio,
      direccion: prismaObj.direccion_entrega ?? '',
      tipo_paquete: prismaObj.tipo_paquete,
      lat: prismaObj.lat,
      lng: prismaObj.lng,
      valor_declarado: prismaObj.valor_declarado,
      cantidad: prismaObj.cantidad,
      imagen_entrega: prismaObj.imagen_entrega,
      observacion_entrega: prismaObj.observacion_entrega
    } as Paquetes;
  }

  async findById(id: number): Promise<Paquetes | null> {
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });
    if (!paquete) return null;
    return this.mapPrismaToDomain(paquete);
  }

  async update(id_paquete: number, data: Partial<Paquetes>): Promise<Paquetes> {
    const prismaData: any = {...data};
    if (data.direccion !== undefined) {
      prismaData.direccion_entrega = data.direccion;
      delete prismaData.direccion;
    }

    const updated = await this.prisma.paquete.update({
      where: {id_paquete},
      data: prismaData
    });

    return this.mapPrismaToDomain(updated);
  }

  async cambiarEstado(
    id: number,
    estado: string,
    observacion?: string | null,
    imagen_entrega?: string | null,
    fecha_entrega?: Date | null
  ): Promise<Paquetes> {
    const exists = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });
    if (!exists) throw new NotFoundException('Paquete no encontrado');

    const data: any = {};

    // ✅ Conversión segura del string a enum
    const estadoEnum =
      paquete_estado_paquete[estado as keyof typeof paquete_estado_paquete];
    if (!estadoEnum) {
      throw new Error(
        `Estado inválido: ${estado}. Debe ser uno de: ${Object.keys(paquete_estado_paquete).join(', ')}`
      );
    }
    data.estado_paquete = estadoEnum;

    if (observacion !== undefined) data.observacion_entrega = observacion;
    if (imagen_entrega !== undefined) data.imagen_entrega = imagen_entrega;

    if (fecha_entrega !== undefined && fecha_entrega !== null) {
      data.fecha_entrega = fecha_entrega;
    }

    const updated = await this.prisma.paquete.update({
      where: {id_paquete: id},
      data
    });

    return this.mapPrismaToDomain(updated);
  }
}
