// src/domain/logistica/rutas/repositories/ruta.repository.ts
import {ruta_estado_ruta} from '@prisma/client';

export interface CreateRutaData {
  estado_ruta: ruta_estado_ruta;
  fecha_inicio: Date;
  fecha_fin?: Date | null;
  id_conductor?: number | null;
  id_vehiculo?: number | null;
  cod_manifiesto?: string | null;
}

export interface RutaEntity {
  id_ruta: number;
  estado_ruta: ruta_estado_ruta;
  fecha_inicio: Date;
  fecha_fin: Date | null;
  id_conductor: number;
  id_vehiculo: number;
  cod_manifiesto: string;
  fecha_creacion: Date;
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    estado_conductor?: {
      estado: string;
    };
  };
  vehiculo?: {
    id_vehiculo: number;
    placa: string;
    tipo: string;
    estado_vehiculo: string;
  };
  paquete?: Array<{
    id_paquete: number;
    codigo_rastreo: string;
    estado_paquete: string;
  }>;
}

export interface RutaRepository {
  // Crear ruta
  create(data: CreateRutaData): Promise<RutaEntity>;

  // Validaciones
  isConductorDisponible(idConductor: number): Promise<boolean>;
  isVehiculoDisponible(idVehiculo: number): Promise<boolean>;

  // Búsqueda de rutas
  findAll(): Promise<RutaEntity[]>;

  // Actualizar
  update(id: number, data: Partial<CreateRutaData>): Promise<RutaEntity>;

  // Eliminar
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<RutaEntity | null>;
}
