// src/infrastructure/persistence/prisma/prisma-vehiculo.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  VehiculoRepository,
  CreateVehiculoData,
  UpdateVehiculoData,
  VehiculoEntity,
} from '../../../domain/logistica/vehiculos/repositories/vehiculo.repository';
import { vehiculo_tipo, vehiculo_estado_vehiculo } from '@prisma/client';

@Injectable()
export class PrismaVehiculoRepository implements VehiculoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVehiculoData): Promise<VehiculoEntity> {
    const vehiculo = await this.prisma.vehiculo.create({
      data: {
        placa: data.placa,
        tipo: data.tipo,
        estado_vehiculo: data.estado_vehiculo || vehiculo_estado_vehiculo.Disponible,
      },
    });

    return this.mapToEntity(vehiculo);
  }

  async findAll(): Promise<VehiculoEntity[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({
      orderBy: { id_vehiculo: 'desc' },
    });

    return vehiculos.map(vehiculo => this.mapToEntity(vehiculo));
  }

  async findById(id: number): Promise<VehiculoEntity | null> {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id_vehiculo: id },
    });

    return vehiculo ? this.mapToEntity(vehiculo) : null;
  }

  async findByPlaca(placa: string): Promise<VehiculoEntity | null> {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { placa: placa.toUpperCase() },
    });

    return vehiculo ? this.mapToEntity(vehiculo) : null;
  }

  async findByEstado(estado: vehiculo_estado_vehiculo): Promise<VehiculoEntity[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({
      where: { estado_vehiculo: estado },
      orderBy: { id_vehiculo: 'desc' },
    });

    return vehiculos.map(vehiculo => this.mapToEntity(vehiculo));
  }

  async findByTipo(tipo: vehiculo_tipo): Promise<VehiculoEntity[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({
      where: { tipo },
      orderBy: { id_vehiculo: 'desc' },
    });

    return vehiculos.map(vehiculo => this.mapToEntity(vehiculo));
  }

  async findDisponibles(): Promise<VehiculoEntity[]> {
    return this.findByEstado(vehiculo_estado_vehiculo.Disponible);
  }

  async update(id: number, data: UpdateVehiculoData): Promise<VehiculoEntity> {
    const vehiculo = await this.prisma.vehiculo.update({
      where: { id_vehiculo: id },
      data,
    });

    return this.mapToEntity(vehiculo);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.vehiculo.delete({
        where: { id_vehiculo: id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async existsByPlaca(placa: string, excludeId?: number): Promise<boolean> {
    const count = await this.prisma.vehiculo.count({
      where: {
        placa: placa.toUpperCase(),
        ...(excludeId && { id_vehiculo: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  /**
   * Mapear de Prisma entity a domain entity
   */
  private mapToEntity(vehiculo: any): VehiculoEntity {
    return {
      id_vehiculo: vehiculo.id_vehiculo,
      placa: vehiculo.placa,
      tipo: vehiculo.tipo,
      estado_vehiculo: vehiculo.estado_vehiculo,
    };
  }
}