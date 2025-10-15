// src/domain/logistics/vehiculos/entities/vehiculo.entity.ts
import { vehiculo_tipo, vehiculo_estado_vehiculo } from '@prisma/client';

/**
 * Entidad de dominio para Vehículo
 * Contiene las reglas de negocio y validaciones
 */
export class VehiculoDomainEntity {
  private _id_vehiculo: number;
  private _placa: string;
  private _tipo: vehiculo_tipo;
  private _estado_vehiculo: vehiculo_estado_vehiculo;

  constructor(
    id_vehiculo: number,
    placa: string,
    tipo: vehiculo_tipo,
    estado_vehiculo: vehiculo_estado_vehiculo
  ) {
    this._id_vehiculo = id_vehiculo;
    this._placa = placa;
    this._tipo = tipo;
    this._estado_vehiculo = estado_vehiculo;

    this.validarInvariantes();
  }

  // ==================== FACTORY METHOD ====================
  
  /**
   * Crea un nuevo vehículo con validaciones
   */
  static crear(
    placa: string,
    tipo: vehiculo_tipo,
    estado_vehiculo: vehiculo_estado_vehiculo = vehiculo_estado_vehiculo.Disponible
  ): VehiculoDomainEntity {
    // Validar placa
    if (!placa || placa.trim().length === 0) {
      throw new Error('La placa es requerida');
    }

    const placaLimpia = placa.trim().toUpperCase();

    // Validar formato de placa colombiana (ABC123)
    const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
    if (!placaRegex.test(placaLimpia)) {
      throw new Error('Formato de placa inválido. Debe ser 3 letras y 3 números (Ej: ABC123)');
    }

    // Validar tipo de vehículo
    if (!Object.values(vehiculo_tipo).includes(tipo)) {
      throw new Error('Tipo de vehículo inválido');
    }

    // Validar estado
    if (!Object.values(vehiculo_estado_vehiculo).includes(estado_vehiculo)) {
      throw new Error('Estado de vehículo inválido');
    }

    return new VehiculoDomainEntity(
      0, // ID temporal, se asignará al persistir
      placaLimpia,
      tipo,
      estado_vehiculo
    );
  }

  // ==================== GETTERS ====================

  get id_vehiculo(): number {
    return this._id_vehiculo;
  }

  get placa(): string {
    return this._placa;
  }

  get tipo(): vehiculo_tipo {
    return this._tipo;
  }

  get estado_vehiculo(): vehiculo_estado_vehiculo {
    return this._estado_vehiculo;
  }

  // ==================== MÉTODOS DE NEGOCIO ====================

  /**
   * Actualizar placa del vehículo
   */
  actualizarPlaca(nuevaPlaca: string): void {
    if (!nuevaPlaca || nuevaPlaca.trim().length === 0) {
      throw new Error('La placa es requerida');
    }

    const placaLimpia = nuevaPlaca.trim().toUpperCase();

    const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
    if (!placaRegex.test(placaLimpia)) {
      throw new Error('Formato de placa inválido. Debe ser 3 letras y 3 números (Ej: ABC123)');
    }

    this._placa = placaLimpia;
  }

  /**
   * Actualizar tipo de vehículo
   */
  actualizarTipo(nuevoTipo: vehiculo_tipo): void {
    if (!Object.values(vehiculo_tipo).includes(nuevoTipo)) {
      throw new Error('Tipo de vehículo inválido');
    }

    this._tipo = nuevoTipo;
  }

  /**
   * Cambiar estado de disponibilidad
   */
  cambiarEstado(disponible: boolean): void {
    this._estado_vehiculo = disponible 
      ? vehiculo_estado_vehiculo.Disponible 
      : vehiculo_estado_vehiculo.No_disponible;
  }

  /**
   * Marcar como disponible
   */
  marcarDisponible(): void {
    this._estado_vehiculo = vehiculo_estado_vehiculo.Disponible;
  }

  /**
   * Marcar como no disponible
   */
  marcarNoDisponible(): void {
    this._estado_vehiculo = vehiculo_estado_vehiculo.No_disponible;
  }

  /**
   * Verificar si está disponible
   */
  estaDisponible(): boolean {
    return this._estado_vehiculo === vehiculo_estado_vehiculo.Disponible;
  }

  /**
   * Verificar si puede ser asignado a una ruta
   */
  puedeSerAsignado(): boolean {
    return this.estaDisponible();
  }

  // ==================== VALIDACIONES ====================

  /**
   * Validar invariantes del dominio
   */
  private validarInvariantes(): void {
    if (!this._placa || this._placa.trim().length === 0) {
      throw new Error('La placa no puede estar vacía');
    }

    const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
    if (!placaRegex.test(this._placa)) {
      throw new Error('Formato de placa inválido');
    }

    if (!Object.values(vehiculo_tipo).includes(this._tipo)) {
      throw new Error('Tipo de vehículo inválido');
    }

    if (!Object.values(vehiculo_estado_vehiculo).includes(this._estado_vehiculo)) {
      throw new Error('Estado de vehículo inválido');
    }
  }

  // ==================== SERIALIZACIÓN ====================

  /**
   * Convertir a objeto plano para persistencia
   */
  toPlainObject() {
    return {
      id_vehiculo: this._id_vehiculo,
      placa: this._placa,
      tipo: this._tipo,
      estado_vehiculo: this._estado_vehiculo,
    };
  }
}