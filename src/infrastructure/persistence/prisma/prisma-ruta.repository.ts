// src/infrastructure/persistence/prisma/prisma-ruta.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RutaRepository, CreateRutaData, RutaEntity } from '../../../domain/logistica/rutas/repositories/ruta.repository';
import { ruta_estado_ruta, estado_conductor_estado, vehiculo_estado_vehiculo } from '@prisma/client';

@Injectable()
export class PrismaRutaRepository implements RutaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRutaData): Promise<RutaEntity> {
    const ruta = await this.prisma.ruta.create({
      data: {
        estado_ruta: data.estado_ruta,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        id_conductor: data.id_conductor,
        id_vehiculo: data.id_vehiculo,
        cod_manifiesto: data.cod_manifiesto,
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
    });

    return this.mapToEntity(ruta);
  }

  async isConductorDisponible(idConductor: number): Promise<boolean> {
    // Verificar que el conductor existe
    const conductor = await this.prisma.usuario.findUnique({
      where: { id_usuario: idConductor },
      include: {
        estado_conductor: true,
      },
    });

    if (!conductor) {
      return false;
    }

    // Verificar que tiene estado de conductor y está disponible
    if (!conductor.estado_conductor || conductor.estado_conductor.estado !== estado_conductor_estado.Disponible) {
      return false;
    }

    // Verificar que no tiene rutas activas (Pendiente, Asignada, En_ruta)
    const rutasActivas = await this.prisma.ruta.count({
      where: {
        id_conductor: idConductor,
        estado_ruta: {
          in: [
            ruta_estado_ruta.Pendiente,
            ruta_estado_ruta.Asignada,
            ruta_estado_ruta.En_ruta,
          ],
        },
      },
    });

    return rutasActivas === 0;
  }

  async isVehiculoDisponible(idVehiculo: number): Promise<boolean> {
    // Verificar que el vehículo existe y está disponible
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id_vehiculo: idVehiculo },
    });

    if (!vehiculo || vehiculo.estado_vehiculo !== vehiculo_estado_vehiculo.Disponible) {
      return false;
    }

    // Verificar que no está asignado a rutas activas
    const rutasActivas = await this.prisma.ruta.count({
      where: {
        id_vehiculo: idVehiculo,
        estado_ruta: {
          in: [
            ruta_estado_ruta.Pendiente,
            ruta_estado_ruta.Asignada,
            ruta_estado_ruta.En_ruta,
          ],
        },
      },
    });

    return rutasActivas === 0;
  }

  async findById(id: number): Promise<RutaEntity | null> {
    const ruta = await this.prisma.ruta.findUnique({
      where: { id_ruta: id },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
    });

    return ruta ? this.mapToEntity(ruta) : null;
  }

  async findAll(): Promise<RutaEntity[]> {
    const rutas = await this.prisma.ruta.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return rutas.map(ruta => this.mapToEntity(ruta));
  }

  async findActivas(): Promise<RutaEntity[]> {
    const rutas = await this.prisma.ruta.findMany({
      where: {
        estado_ruta: {
          in: [
            ruta_estado_ruta.Pendiente,
            ruta_estado_ruta.Asignada,
            ruta_estado_ruta.En_ruta,
          ],
        },
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return rutas.map(ruta => this.mapToEntity(ruta));
  }

  async findHistorial(): Promise<RutaEntity[]> {
    const rutas = await this.prisma.ruta.findMany({
      where: {
        estado_ruta: {
          in: [ruta_estado_ruta.Completada, ruta_estado_ruta.Fallida],
        },
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return rutas.map(ruta => this.mapToEntity(ruta));
  }

  async findByConductor(idConductor: number): Promise<RutaEntity[]> {
    const rutas = await this.prisma.ruta.findMany({
      where: { id_conductor: idConductor },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return rutas.map(ruta => this.mapToEntity(ruta));
  }

  async update(id: number, data: Partial<CreateRutaData>): Promise<RutaEntity> {
    const ruta = await this.prisma.ruta.update({
      where: { id_ruta: id },
      data,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            estado_conductor: {
              select: {
                estado: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            id_vehiculo: true,
            placa: true,
            tipo: true,
            estado_vehiculo: true,
          },
        },
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true,
          },
        },
      },
    });

    return this.mapToEntity(ruta);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.ruta.delete({
        where: { id_ruta: id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToEntity(ruta: any): RutaEntity {
    return {
      id_ruta: ruta.id_ruta,
      estado_ruta: ruta.estado_ruta,
      fecha_inicio: ruta.fecha_inicio,
      fecha_fin: ruta.fecha_fin,
      id_conductor: ruta.id_conductor,
      id_vehiculo: ruta.id_vehiculo,
      cod_manifiesto: ruta.cod_manifiesto,
      fecha_creacion: ruta.fecha_creacion,
      usuario: ruta.usuario,
      vehiculo: ruta.vehiculo,
      paquete: ruta.paquete,
    };
  }
}