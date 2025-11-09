import {Injectable} from '@nestjs/common';
import {UbicacionRepository} from 'src/domain/ubicaciones/repositories/ubicacion.repository';
import {Ubicacion} from 'src/domain/ubicaciones/entities/ubicacion.entity';
import {PrismaService} from 'src/prisma/prisma.service';

@Injectable()
export class PrismaUbicacionRepository implements UbicacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Crear siempre un nuevo registro
  async crear(data: {
    id_ruta: number;
    lat: number;
    lng: number;
  }): Promise<Ubicacion> {
    const ubicacion = await this.prisma.ubicacion_conductor.create({data});
    return new Ubicacion(
      ubicacion.id_ubicacion,
      ubicacion.id_ruta,
      Number(ubicacion.lat),
      Number(ubicacion.lng),
      ubicacion.fecha_registro
    );
  }

  // Crear o actualizar si ya existe la ubicación de la ruta
  async crearOActualizar(data: {
    id_ruta: number;
    lat: number;
    lng: number;
  }): Promise<Ubicacion> {
    const existente = await this.prisma.ubicacion_conductor.findFirst({
      where: {id_ruta: data.id_ruta},
      orderBy: {fecha_registro: 'desc'}
    });

    if (existente) {
      const updated = await this.prisma.ubicacion_conductor.update({
        where: {id_ubicacion: existente.id_ubicacion},
        data: {
          lat: data.lat,
          lng: data.lng,
          fecha_registro: new Date()
        }
      });
      return new Ubicacion(
        updated.id_ubicacion,
        updated.id_ruta,
        Number(updated.lat),
        Number(updated.lng),
        updated.fecha_registro
      );
    } else {
      const created = await this.prisma.ubicacion_conductor.create({data});
      return new Ubicacion(
        created.id_ubicacion,
        created.id_ruta,
        Number(created.lat),
        Number(created.lng),
        created.fecha_registro
      );
    }
  }

  // ✅ Método que faltaba para obtener todas las ubicaciones de una ruta
  async obtenerPorRuta(id_ruta: number): Promise<Ubicacion[]> {
    const ubicaciones = await this.prisma.ubicacion_conductor.findMany({
      where: {id_ruta},
      orderBy: {fecha_registro: 'asc'}
    });

    return ubicaciones.map(
      u =>
        new Ubicacion(
          u.id_ubicacion,
          u.id_ruta,
          Number(u.lat),
          Number(u.lng),
          u.fecha_registro
        )
    );
  }
}
