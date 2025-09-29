// src/domain/logistica/rutas/entities/ruta.entity.ts
import {ruta_estado_ruta} from '@prisma/client';

export class RutaDomainEntity {
  private _id_ruta: number;
  private _estado_ruta: ruta_estado_ruta;
  private _fecha_inicio: Date;
  private _fecha_fin: Date | null;
  private _id_conductor: number | null;
  private _id_vehiculo: number | null;
  private _cod_manifiesto: string | null;
  private _fecha_creacion: Date;
  private _paquetes: number[] = []; // IDs de paquetes asignados

  constructor(
    id_ruta: number,
    estado_ruta: ruta_estado_ruta,
    fecha_inicio: Date,
    fecha_fin: Date | null,
    id_conductor: number | null,
    id_vehiculo: number | null,
    cod_manifiesto: string | null,
    fecha_creacion: Date,
    paquetes: number[] = []
  ) {
    this._id_ruta = id_ruta;
    this._estado_ruta = estado_ruta;
    this._fecha_inicio = fecha_inicio;
    this._fecha_fin = fecha_fin;
    this._id_conductor = id_conductor;
    this._id_vehiculo = id_vehiculo;
    this._cod_manifiesto = cod_manifiesto;
    this._fecha_creacion = fecha_creacion;
    this._paquetes = paquetes;

    this.validarInvariantes();
  }

  // Factory method para crear nueva ruta
  static crear(
    fecha_inicio: Date,
    fecha_fin: Date | null = null,
    id_conductor: number | null = null,
    id_vehiculo: number | null = null
  ): RutaDomainEntity {
    const now = new Date();

    // Validaciones de fechas
    if (fecha_inicio < now) {
      throw new Error(
        'La fecha de inicio no puede ser anterior a la fecha actual'
      );
    }
    if (fecha_fin && fecha_fin <= fecha_inicio) {
      throw new Error(
        'La fecha de fin debe ser posterior a la fecha de inicio'
      );
    }

    // Creamos la instancia con valores temporales para ID y fecha de creación
    const ruta = new RutaDomainEntity(
      0, // _id_ruta temporal; se reemplaza al persistir
      ruta_estado_ruta.Pendiente,
      fecha_inicio,
      fecha_fin,
      id_conductor,
      id_vehiculo,
      null, // cod_manifiesto inicialmente null
      new Date(), // fecha_creacion temporal
      [] // paquetes vacíos
    );

    return ruta;
  }

  // Getters
  get id_ruta(): number {
    return this._id_ruta;
  }
  get estado_ruta(): ruta_estado_ruta {
    return this._estado_ruta;
  }
  get fecha_inicio(): Date {
    return this._fecha_inicio;
  }
  get fecha_fin(): Date | null {
    return this._fecha_fin;
  }
  get id_conductor(): number | null {
    return this._id_conductor;
  }
  get id_vehiculo(): number | null {
    return this._id_vehiculo;
  }
  get cod_manifiesto(): string | null {
    return this._cod_manifiesto;
  }
  get fecha_creacion(): Date {
    return this._fecha_creacion;
  }
  get paquetes(): number[] {
    return [...this._paquetes];
  }

  // Métodos de negocio para asignaciones
  asignarConductor(idConductor: number): void {
    if (this._estado_ruta !== ruta_estado_ruta.Pendiente) {
      throw new Error('Solo se puede asignar conductor a rutas pendientes');
    }

    if (this._id_conductor && this._id_conductor !== idConductor) {
      throw new Error('La ruta ya tiene un conductor asignado diferente');
    }

    this._id_conductor = idConductor;

    // Generar código de manifiesto cuando se asigna conductor
    if (!this._cod_manifiesto) {
      this._cod_manifiesto = this.generarCodigoManifiesto();
    }

    // Cambiar estado a Asignada si tiene todas las asignaciones necesarias
    this.actualizarEstadoPorAsignaciones();
  }

  asignarVehiculo(idVehiculo: number): void {
    if (
      this._estado_ruta !== ruta_estado_ruta.Pendiente &&
      this._estado_ruta !== ruta_estado_ruta.Asignada
    ) {
      throw new Error(
        'Solo se puede asignar vehículo a rutas pendientes o asignadas'
      );
    }

    if (this._id_vehiculo && this._id_vehiculo !== idVehiculo) {
      throw new Error('La ruta ya tiene un vehículo asignado diferente');
    }

    this._id_vehiculo = idVehiculo;
    this.actualizarEstadoPorAsignaciones();
  }

  asignarPaquetes(idsPaquetes: number[]): void {
    if (
      this._estado_ruta !== ruta_estado_ruta.Pendiente &&
      this._estado_ruta !== ruta_estado_ruta.Asignada
    ) {
      throw new Error(
        'Solo se pueden asignar paquetes a rutas pendientes o asignadas'
      );
    }

    // Agregar paquetes evitando duplicados
    const nuevosIds = idsPaquetes.filter(id => !this._paquetes.includes(id));
    this._paquetes.push(...nuevosIds);

    this.actualizarEstadoPorAsignaciones();
  }

  // Métodos de negocio para remover asignaciones
  removerConductor(): void {
    if (this._estado_ruta === ruta_estado_ruta.En_ruta) {
      throw new Error('No se puede remover conductor de una ruta en curso');
    }

    this._id_conductor = null;
    this._cod_manifiesto = null; // Se pierde el manifiesto al remover conductor
    this._estado_ruta = ruta_estado_ruta.Pendiente;
  }

  removerVehiculo(): void {
    if (this._estado_ruta === ruta_estado_ruta.En_ruta) {
      throw new Error('No se puede remover vehículo de una ruta en curso');
    }

    this._id_vehiculo = null;
    this._estado_ruta = ruta_estado_ruta.Pendiente;
    this.actualizarEstadoPorAsignaciones();
  }

  removerPaquete(idPaquete: number): void {
    if (this._estado_ruta === ruta_estado_ruta.En_ruta) {
      throw new Error('No se pueden remover paquetes de una ruta en curso');
    }

    this._paquetes = this._paquetes.filter(id => id !== idPaquete);
    this.actualizarEstadoPorAsignaciones();
  }

  removerTodosPaquetes(): void {
    if (this._estado_ruta === ruta_estado_ruta.En_ruta) {
      throw new Error('No se pueden remover paquetes de una ruta en curso');
    }

    this._paquetes = [];
    this._estado_ruta = ruta_estado_ruta.Pendiente;
    this.actualizarEstadoPorAsignaciones();
  }

  // Métodos de negocio para cambios de estado
  iniciar(): void {
    if (!this.puedeIniciar()) {
      throw new Error(
        'La ruta no puede iniciar. Debe tener conductor, vehículo y paquetes asignados'
      );
    }

    this._estado_ruta = ruta_estado_ruta.En_ruta;
  }

  completar(): void {
    if (this._estado_ruta !== ruta_estado_ruta.En_ruta) {
      throw new Error('Solo se pueden completar rutas en curso');
    }

    this._estado_ruta = ruta_estado_ruta.Completada;
    this._fecha_fin = new Date();
  }

  marcarFallida(motivo?: string): void {
    if (this._estado_ruta !== ruta_estado_ruta.En_ruta) {
      throw new Error('Solo se pueden marcar como fallidas las rutas en curso');
    }

    this._estado_ruta = ruta_estado_ruta.Fallida;
    this._fecha_fin = new Date();
  }

  // Métodos de validación
  puedeIniciar(): boolean {
    return (
      this._estado_ruta === ruta_estado_ruta.Asignada &&
      this._id_conductor !== null &&
      this._id_vehiculo !== null &&
      this._paquetes.length > 0
    );
  }

  puedeAsignarConductor(): boolean {
    return this._estado_ruta === ruta_estado_ruta.Pendiente;
  }

  puedeAsignarVehiculo(): boolean {
    return (
      this._estado_ruta === ruta_estado_ruta.Pendiente ||
      this._estado_ruta === ruta_estado_ruta.Asignada
    );
  }

  puedeAsignarPaquetes(): boolean {
    return (
      this._estado_ruta === ruta_estado_ruta.Pendiente ||
      this._estado_ruta === ruta_estado_ruta.Asignada
    );
  }

  estaActiva(): boolean {
    const estadosActivos = new Set<ruta_estado_ruta>([
      ruta_estado_ruta.Pendiente,
      ruta_estado_ruta.Asignada,
      ruta_estado_ruta.En_ruta
    ]);
    return estadosActivos.has(this._estado_ruta);
  }

  estaEnHistorial(): boolean {
    const estadosHistorial = new Set<ruta_estado_ruta>([
      ruta_estado_ruta.Completada,
      ruta_estado_ruta.Fallida
    ]);
    return estadosHistorial.has(this._estado_ruta);
  }

  // Métodos privados
  private generarCodigoManifiesto(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp

    return `MAN-${year}${month}${day}-${timestamp}`;
  }

  private actualizarEstadoPorAsignaciones(): void {
    // Solo actualizar si está en Pendiente
    if (this._estado_ruta !== ruta_estado_ruta.Pendiente) {
      return;
    }

    // Una ruta está "Asignada" cuando tiene conductor, vehículo y al menos un paquete
    const tieneTodasLasAsignaciones =
      this._id_conductor !== null &&
      this._id_vehiculo !== null &&
      this._paquetes.length > 0;

    if (tieneTodasLasAsignaciones) {
      this._estado_ruta = ruta_estado_ruta.Asignada;
    }
  }

  private validarInvariantes(): void {
    if (this._fecha_fin && this._fecha_fin <= this._fecha_inicio) {
      throw new Error(
        'La fecha de fin debe ser posterior a la fecha de inicio'
      );
    }

    // Validar estados coherentes
    if (this._estado_ruta === ruta_estado_ruta.En_ruta) {
      if (
        !this._id_conductor ||
        !this._id_vehiculo ||
        this._paquetes.length === 0
      ) {
        throw new Error(
          'Una ruta en curso debe tener conductor, vehículo y paquetes'
        );
      }
    }

    if (this._cod_manifiesto && !this._id_conductor) {
      throw new Error('No puede existir código de manifiesto sin conductor');
    }
  }

  // Método para serializar a formato de persistencia
  toPlainObject() {
    return {
      id_ruta: this._id_ruta,
      estado_ruta: this._estado_ruta,
      fecha_inicio: this._fecha_inicio,
      fecha_fin: this._fecha_fin,
      id_conductor: this._id_conductor,
      id_vehiculo: this._id_vehiculo,
      cod_manifiesto: this._cod_manifiesto,
      fecha_creacion: this._fecha_creacion,
      paquetes: this._paquetes
    };
  }
}
