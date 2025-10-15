// src/domain/logistics/vehiculos/repositories/vehiculo.repository.ts
import { vehiculo_tipo, vehiculo_estado_vehiculo } from '@prisma/client';

/**
 * Datos para crear un vehículo
 */
export interface CreateVehiculoData {
  placa: string;
  tipo: vehiculo_tipo;
  estado_vehiculo?: vehiculo_estado_vehiculo;
}

/**
 * Datos para actualizar un vehículo
 */
export interface UpdateVehiculoData {
  placa?: string;
  tipo?: vehiculo_tipo;
  estado_vehiculo?: vehiculo_estado_vehiculo;
}

/**
 * Entidad de vehículo para respuestas del repositorio
 */
export interface VehiculoEntity {
  id_vehiculo: number;
  placa: string;
  tipo: vehiculo_tipo;
  estado_vehiculo: vehiculo_estado_vehiculo;
}

/**
 * Interfaz del repositorio de vehículos
 * Define el contrato que debe cumplir la implementación
 */
export interface VehiculoRepository {
  /**
   * Crear un nuevo vehículo
   */
  create(data: CreateVehiculoData): Promise<VehiculoEntity>;

  /**
   * Obtener todos los vehículos
   */
  findAll(): Promise<VehiculoEntity[]>;

  /**
   * Obtener un vehículo por ID
   */
  findById(id: number): Promise<VehiculoEntity | null>;

  /**
   * Obtener un vehículo por placa
   */
  findByPlaca(placa: string): Promise<VehiculoEntity | null>;

  /**
   * Obtener vehículos por estado
   */
  findByEstado(estado: vehiculo_estado_vehiculo): Promise<VehiculoEntity[]>;

  /**
   * Obtener vehículos por tipo
   */
  findByTipo(tipo: vehiculo_tipo): Promise<VehiculoEntity[]>;

  /**
   * Obtener vehículos disponibles
   */
  findDisponibles(): Promise<VehiculoEntity[]>;

  /**
   * Actualizar un vehículo
   */
  update(id: number, data: UpdateVehiculoData): Promise<VehiculoEntity>;

  /**
   * Eliminar un vehículo
   */
  delete(id: number): Promise<boolean>;

  /**
   * Verificar si una placa ya existe
   */
  existsByPlaca(placa: string, excludeId?: number): Promise<boolean>;
}