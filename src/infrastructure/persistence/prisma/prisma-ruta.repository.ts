import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {
  RutaRepository,
  CreateRutaData,
  RutaEntity
} from 'src/domain/logistica/rutas/repositories/ruta.repository';

@Injectable()
export class PrismaRutaRepository implements RutaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Crear ruta
  async create(data: CreateRutaData): Promise<RutaEntity> {
    const ruta = await this.prisma.ruta.create({data});
    return this.mapToEntity(ruta);
  }

  // Validaciones
  async isConductorDisponible(idConductor: number): Promise<boolean> {
    const ruta = await this.prisma.ruta.findFirst({
      where: {
        id_conductor: idConductor,
        estado_ruta: {in: ['Asignada', 'En_ruta']}
      }
    });
    return !ruta;
  }

  async isVehiculoDisponible(idVehiculo: number): Promise<boolean> {
    const ruta = await this.prisma.ruta.findFirst({
      where: {
        id_vehiculo: idVehiculo,
        estado_ruta: {in: ['Asignada', 'En_ruta']}
      }
    });
    return !ruta;
  }

  // Obtener todas las rutas
  async findAll(): Promise<RutaEntity[]> {
    const rutas = await this.prisma.ruta.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true
          }
        },
        vehiculo: true,
        paquete: {
          include: {
            cliente: true,
            barrio: {include: {localidad: true}}
          }
        }
      },
      orderBy: {fecha_creacion: 'desc'}
    });

    return rutas.map(r => this.mapToEntity(r));
  }

  // Obtener ruta por id
  async findById(id: number): Promise<RutaEntity | null> {
    const ruta = await this.prisma.ruta.findUnique({
      where: {id_ruta: id},
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true
          }
        },
        vehiculo: true,
        paquete: {
          include: {
            cliente: true,
            barrio: {include: {localidad: true}}
          }
        }
      }
    });
    return ruta ? this.mapToEntity(ruta) : null;
  }

  // Actualizar ruta y estado del conductor automáticamente
  async update(id: number, data: Partial<CreateRutaData>): Promise<RutaEntity> {
    const rutaActualizada = await this.prisma.ruta.update({
      where: {id_ruta: id},
      data
    });

    // Actualizar estado del conductor según el estado de la ruta
    if (rutaActualizada.id_conductor) {
      let estadoConductor: 'Disponible' | 'En_ruta' = 'Disponible';
      if (
        rutaActualizada.estado_ruta === 'Asignada' ||
        rutaActualizada.estado_ruta === 'En_ruta'
      ) {
        estadoConductor = 'En_ruta';
      }

      await this.prisma.estado_conductor.update({
        where: {id_conductor: rutaActualizada.id_conductor},
        data: {estado: estadoConductor}
      });
    }

    return this.mapToEntity(rutaActualizada);
  }

  // Eliminar
  async delete(id: number): Promise<boolean> {
    await this.prisma.ruta.delete({where: {id_ruta: id}});
    return true;
  }
  // Obtener ruta por código de manifiesto
  async findByCodigoManifiesto(codigo: string): Promise<RutaEntity | null> {
    const ruta = await this.prisma.ruta.findFirst({
      where: {cod_manifiesto: codigo},
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true
          }
        },
        vehiculo: true,
        paquete: {
          include: {
            cliente: true,
            barrio: {include: {localidad: true}}
          }
        }
      }
    });

    return ruta ? this.mapToEntity(ruta) : null;
  }

  async findUsuarioByUid(uid: string) {
    return this.prisma.usuario.findUnique({
      where: {uid},
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true
      }
    });
  }

  // Mapeo de Prisma a entidad
  private mapToEntity(ruta: any): RutaEntity {
    return {
      id_ruta: ruta.id_ruta,
      estado_ruta: ruta.estado_ruta,
      fecha_inicio: ruta.fecha_inicio,
      fecha_fin: ruta.fecha_fin,
      id_conductor: ruta.id_conductor ?? 0,
      id_vehiculo: ruta.id_vehiculo ?? 0,
      cod_manifiesto: ruta.cod_manifiesto ?? '',
      fecha_creacion: ruta.fecha_creacion,
      usuario: ruta.usuario
        ? {
            id_usuario: ruta.usuario.id_usuario,
            nombre: ruta.usuario.nombre,
            apellido: ruta.usuario.apellido,
            correo: ruta.usuario.correo
          }
        : undefined,
      vehiculo: ruta.vehiculo
        ? {
            id_vehiculo: ruta.vehiculo.id_vehiculo,
            placa: ruta.vehiculo.placa,
            tipo: ruta.vehiculo.tipo,
            estado_vehiculo: ruta.vehiculo.estado_vehiculo
          }
        : undefined,
      paquete: ruta.paquete
        ? ruta.paquete.map((p: any) => ({
            id_paquete: p.id_paquete,
            codigo_rastreo: p.codigo_rastreo,
            estado_paquete: p.estado_paquete,
            cantidad: p.cantidad,
            direccion_entrega: p.direccion_entrega,
            cliente: p.cliente
              ? {
                  id_cliente: p.cliente.id_cliente,
                  nombre: p.cliente.nombre,
                  apellido: p.cliente.apellido,
                  telefono_movil: p.cliente.telefono_movil,
                  direccion: p.cliente.direccion
                }
              : undefined
          }))
        : []
    };
  }
}
