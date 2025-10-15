// src/domain/logistica/rutas/mappers/ruta-domain.mapper.ts
import { RutaDomainEntity } from '../entities/ruta.entity';
import { CreateRutaData, RutaEntity } from '../repositories/ruta.repository';

/**
 * Mapper para traducir entre la entidad de dominio y los datos de persistencia
 * Respeta la arquitectura hexagonal manteniendo el dominio independiente
 */
export class RutaDomainMapper {
  /**
   * Convierte la entidad de dominio a datos para crear en el repositorio
   */
  static toCreateData(rutaDomain: RutaDomainEntity): CreateRutaData {
    return {
      estado_ruta: rutaDomain.estado_ruta,
      fecha_inicio: rutaDomain.fecha_inicio,
      fecha_fin: rutaDomain.fecha_fin,
      id_conductor: rutaDomain.id_conductor,
      id_vehiculo: rutaDomain.id_vehiculo,
      cod_manifiesto: rutaDomain.cod_manifiesto,
    };
  }

  /**
   * Convierte los datos de persistencia a entidad de dominio
   */
  static toDomain(rutaEntity: RutaEntity): RutaDomainEntity {
    // Extraer IDs de paquetes si existen
    const paquetesIds = rutaEntity.paquete?.map(p => p.id_paquete) || [];

    return new RutaDomainEntity(
      rutaEntity.id_ruta,
      rutaEntity.estado_ruta,
      rutaEntity.fecha_inicio,
      rutaEntity.fecha_fin,
      rutaEntity.id_conductor,
      rutaEntity.id_vehiculo,
      rutaEntity.cod_manifiesto,
      rutaEntity.fecha_creacion,
      paquetesIds
    );
  }

  /**
   * Convierte la entidad de dominio a datos para actualizar en el repositorio
   */
  static toUpdateData(rutaDomain: RutaDomainEntity): Partial<CreateRutaData> {
    return {
      estado_ruta: rutaDomain.estado_ruta,
      fecha_inicio: rutaDomain.fecha_inicio,
      fecha_fin: rutaDomain.fecha_fin,
      id_conductor: rutaDomain.id_conductor,
      id_vehiculo: rutaDomain.id_vehiculo,
      cod_manifiesto: rutaDomain.cod_manifiesto,
    };
  }
}