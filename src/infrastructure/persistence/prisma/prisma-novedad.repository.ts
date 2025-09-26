import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {
  NovedadRepository,
  CrearNovedadProps
} from '../../../domain/novedades/repositories/novedad.repository';
import {Novedad} from '../../../domain/novedades/entities/novedad.entity';

@Injectable()
export class PrismaNovedadRepository implements NovedadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearNovedadProps): Promise<Novedad> {
    const created = await this.prisma.novedades.create({
      data: {
        descripcion: data.descripcion,
        tipo: data.tipo,
        fecha: data.fecha ?? new Date(),
        imagen: data.imagen ?? null,
        usuario: {
          connect: {uid: data.uid} // se toma del data
        }
      }
    });

    return new Novedad(
      created.id_novedad,
      created.descripcion,
      created.tipo,
      created.fecha,
      created.id_usuario,
      created.imagen
    );
  }

  async listar(): Promise<Novedad[]> {
    const list = await this.prisma.novedades.findMany({
      include: {usuario: true}
    });

    return list.map(
      n =>
        new Novedad(
          n.id_novedad,
          n.descripcion,
          n.tipo,
          n.fecha,
          n.id_usuario,
          n.imagen
        )
    );
  }
}
