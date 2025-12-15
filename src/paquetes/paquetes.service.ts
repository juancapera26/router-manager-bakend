// src/paquetes/paquetes.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaqueteDto } from '../interface/controllers/dto/create-paquete.dto';
import { UpdatePaqueteDto } from '../interface/controllers/dto/update-paquete.dto';
import { AsignarPaqueteDto } from '../interface/controllers/dto/asignar-paquete.dto';
import { EstadoPaqueteDto } from '../interface/controllers/dto/estado-paquete.dto';
import { paquete_estado_paquete } from '@prisma/client';
import { NotificationsService } from 'src/application/notifications/notifications.service';

@Injectable()
export class PaquetesService {
  private readonly logger = new Logger(PaquetesService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  // ==========================================================
  // CRUD PRINCIPAL
  // ==========================================================

  getAll() {
    return this.prisma.paquete.findMany({
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  async getOne(id: number) { 
    return this.prisma.paquete.findUnique({
      where: { id_paquete: id },
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  async create(dto: CreatePaqueteDto) {
    const nuevoCliente = await this.prisma.cliente.create({
      data: {
        nombre: dto.destinatario.nombre,
        apellido: dto.destinatario.apellido,
        direccion: dto.destinatario.direccion,
        correo: dto.destinatario.correo,
        telefono_movil: dto.destinatario.telefono
      }
    });

    const paqueteCreado = await this.prisma.paquete.create({
  data: {
    // REMITENTE
    remitente_nombre: dto.remitente.remitente_nombre,
    remitente_apellido: dto.remitente.remitente_apellido,
    remitente_telefono: dto.remitente.remitente_telefono,
    remitente_correo: dto.remitente.remitente_correo,
    remitente_empresa: dto.remitente.remitente_empresa,

    // DIMENSIONES
    largo: dto.dimensiones.largo,
    ancho: dto.dimensiones.ancho,
    alto: dto.dimensiones.alto,
    peso: dto.dimensiones.peso,

    // PAQUETE
    tipo_paquete: dto.tipo_paquete,
    cantidad: dto.cantidad,
    valor_declarado: dto.valor_declarado,

    // DESTINATARIO
    direccion_entrega:
      dto.direccion_entrega || dto.destinatario.direccion,

    id_cliente: nuevoCliente.id_cliente,
    lat: dto.lat,
    lng: dto.lng,
    id_barrio: dto.id_barrio,

    estado_paquete: 'Pendiente',
    fecha_registro: new Date(),
  },

  include: {
    cliente: true,
    ruta:true,
    barrio:true,
  },
});
    if (!paqueteCreado.codigo_rastreo) {
      const codigoRastreo = `PKG-${String(paqueteCreado.id_paquete).padStart(6, '0')}`;
      return this.prisma.paquete.update({
        where: { id_paquete: paqueteCreado.id_paquete },
        data: { codigo_rastreo: codigoRastreo },
        include: { cliente: true, barrio: true }
      });
    }

    return paqueteCreado;
  }

  async update(id: number, dto: UpdatePaqueteDto) {
    const data: any = {};

    if (dto.largo !== undefined) data.largo = dto.largo;
    if (dto.ancho !== undefined) data.ancho = dto.ancho;
    if (dto.alto !== undefined) data.alto = dto.alto;
    if (dto.peso !== undefined) data.peso = dto.peso;

    if (dto.tipo_paquete !== undefined) data.tipo_paquete = dto.tipo_paquete;
    if (dto.valor_declarado !== undefined) data.valor_declarado = dto.valor_declarado;
    if (dto.cantidad !== undefined) data.cantidad = dto.cantidad;
    if (dto.direccion_entrega !== undefined) data.direccion_entrega = dto.direccion_entrega;

    if (dto.id_ruta !== undefined) data.id_ruta = dto.id_ruta;
    if (dto.id_barrio !== undefined) data.id_barrio = dto.id_barrio;

    if (dto.lat !== undefined) data.lat = dto.lat;
    if (dto.lng !== undefined) data.lng = dto.lng;

    if (dto.fecha_entrega !== undefined) data.fecha_entrega = dto.fecha_entrega;

    if (dto.id_cliente !== undefined) {
      data.cliente = { connect: { id_cliente: dto.id_cliente } };
    }

    return this.prisma.paquete.update({
      where: { id_paquete: id },
      data,
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  delete(id: number) {
    return this.prisma.paquete.delete({
      where: { id_paquete: id },
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  // ==========================================================
  // ASIGNAR / REASIGNAR / CANCELAR
  // ==========================================================

  async asignar(id: number, dto: AsignarPaqueteDto) {
    if (!dto.id_ruta && !dto.cod_manifiesto) {
      throw new BadRequestException('Se requiere id_ruta o cod_manifiesto');
    }

    const paquete = await this.prisma.paquete.findUnique({
      where: { id_paquete: id }
    });

    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    if (paquete.estado_paquete !== 'Pendiente') {
      throw new BadRequestException(
        `El paquete ya está en estado ${paquete.estado_paquete}`
      );
    }

    let ruta;
    if (dto.cod_manifiesto) {
      ruta = await this.prisma.ruta.findUnique({
        where: { cod_manifiesto: dto.cod_manifiesto }
      });
    } else {
      ruta = await this.prisma.ruta.findUnique({
        where: { id_ruta: dto.id_ruta }
      });
    }

    if (!ruta) {
      throw new NotFoundException(
        dto.cod_manifiesto
          ? `Ruta con código ${dto.cod_manifiesto} no encontrada`
          : `Ruta con ID ${dto.id_ruta} no encontrada`
      );
    }

    if (ruta.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        `La ruta no está disponible. Estado actual: ${ruta.estado_ruta}`
      );
    }

    return this.prisma.paquete.update({
      where: { id_paquete: id },
      data: {
        id_ruta: ruta.id_ruta,
        estado_paquete: 'Asignado'
      },
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  async reasignar(id: number, dto: AsignarPaqueteDto) {
    return this.asignar(id, dto);
  }

  async cancelar(id: number) {
    const paquete = await this.prisma.paquete.findUnique({
      where: { id_paquete: id }
    });

    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    return this.prisma.paquete.update({
      where: { id_paquete: id },
      data: {
        estado_paquete: 'Pendiente',
        id_ruta: null
      },
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  // ==========================================================
  // CAMBIAR ESTADO + ACTUALIZAR AUTOMÁTICAMENTE ESTADO DE LA RUTA
  // ==========================================================

  /**
   * 🔔 Cambia el estado del paquete y verifica automáticamente el estado de la ruta
   * Si todos los paquetes están procesados, notifica a los admins
   */
  async cambiarEstado(id: number, dto: EstadoPaqueteDto) {
    const paquete = await this.prisma.paquete.findUnique({
      where: { id_paquete: id },
      include: { ruta: true }
    });

    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    // No permitir alterar estados finales
    if (
      (paquete.estado_paquete === 'Entregado' && dto.estado !== 'Entregado') ||
      (paquete.estado_paquete === 'Fallido' && dto.estado !== 'Fallido')
    ) {
      throw new BadRequestException(
        'No se puede modificar un paquete ya entregado o fallido'
      );
    }

    this.logger.log(`📦 Cambiando estado del paquete ${id} a "${dto.estado}"`);

    // Actualizar el paquete
    const paqueteActualizado = await this.prisma.paquete.update({
      where: { id_paquete: id },
      data: { estado_paquete: dto.estado },
      include: { cliente: true, ruta: true, barrio: true }
    });

    // Si no pertenece a una ruta → terminar
    if (!paqueteActualizado.id_ruta) {
      this.logger.log(`⚠️ Paquete ${id} no pertenece a ninguna ruta`);
      return paqueteActualizado;
    }

    // 🔔 Verificar y actualizar estado de la ruta
    await this.verificarYActualizarEstadoRuta(paqueteActualizado.id_ruta);

    return paqueteActualizado;
  }

  // ==========================================================
  // 🔔 MÉTODO AUXILIAR: VERIFICAR Y ACTUALIZAR ESTADO DE RUTA
  // ==========================================================

  /**
   * Verifica todos los paquetes de una ruta y actualiza su estado
   * Envía notificaciones a los admins cuando la ruta se completa o falla
   */
  private async verificarYActualizarEstadoRuta(idRuta: number): Promise<void> {
    this.logger.log(`🔍 Verificando estado de la ruta ${idRuta}...`);

    // Traer todos los paquetes de la ruta
    const paquetesDeLaRuta = await this.prisma.paquete.findMany({
      where: { id_ruta: idRuta }
    });

    if (paquetesDeLaRuta.length === 0) {
      this.logger.warn(`⚠️ La ruta ${idRuta} no tiene paquetes asignados`);
      return;
    }

    this.logger.log(`📊 Ruta ${idRuta} tiene ${paquetesDeLaRuta.length} paquetes`);

    // Verificar estados de los paquetes
    const todosEntregados = paquetesDeLaRuta.every(
      p => p.estado_paquete === 'Entregado'
    );

    const hayFallidos = paquetesDeLaRuta.some(
      p => p.estado_paquete === 'Fallido'
    );

    const todosProcesados = paquetesDeLaRuta.every(
      p => p.estado_paquete === 'Entregado' || p.estado_paquete === 'Fallido'
    );

    // Log de estado actual
    const entregados = paquetesDeLaRuta.filter(p => p.estado_paquete === 'Entregado').length;
    const fallidos = paquetesDeLaRuta.filter(p => p.estado_paquete === 'Fallido').length;
    const pendientes = paquetesDeLaRuta.filter(p => 
      p.estado_paquete !== 'Entregado' && p.estado_paquete !== 'Fallido'
    ).length;

    this.logger.log(
      `📊 Estado de paquetes: ` +
      `✅ ${entregados} entregados, ` +
      `❌ ${fallidos} fallidos, ` +
      `⏳ ${pendientes} pendientes`
    );

    // Determinar nuevo estado de la ruta
    let nuevoEstadoRuta: 'Completada' | 'Fallida' | null = null;

    if (!todosProcesados) {
      this.logger.log(`⏳ Aún hay paquetes sin procesar, la ruta sigue en curso`);
      return;
    }

    // SOLO cambiar estado si todos los paquetes están procesados
    if (hayFallidos) {
      nuevoEstadoRuta = 'Fallida';
      this.logger.log(`❌ Hay entregas fallidas, marcando ruta como Fallida`);
    } else if (todosEntregados) {
      nuevoEstadoRuta = 'Completada';
      this.logger.log(`✅ Todos los paquetes entregados, marcando ruta como Completada`);
    }

    // Actualizar la ruta y enviar notificación
    if (nuevoEstadoRuta) {
      const rutaActualizada = await this.prisma.ruta.update({
        where: { id_ruta: idRuta },
        data: { 
          estado_ruta: nuevoEstadoRuta,
          fecha_fin: new Date() // 👈 Opcional: registrar cuándo se completó
        }
      });

      // 🔔 ENVIAR NOTIFICACIÓN A TODOS LOS ADMINS
      if (rutaActualizada.cod_manifiesto) {
        this.notificationsService.notifyAllAdmins({
          type: nuevoEstadoRuta === 'Completada' ? 'ruta_completada' : 'ruta_fallida',
          title: `Ruta ${nuevoEstadoRuta}`,
          message: `La ruta ${rutaActualizada.cod_manifiesto} ha sido marcada como ${nuevoEstadoRuta}`,
          data: {
            id_ruta: idRuta,
            cod_manifiesto: rutaActualizada.cod_manifiesto,
            estado_ruta: nuevoEstadoRuta,
          },
          timestamp: new Date(),
        });

        this.logger.log(
          `🔔 Notificación enviada a todos los admins: Ruta ${rutaActualizada.cod_manifiesto} → ${nuevoEstadoRuta}`
        );
      } else {
        this.logger.warn(`⚠️ Ruta ${idRuta} no tiene código de manifiesto, notificación no enviada`);
      }
    }
  }

  // ==========================================================
  // CONSULTAS ADICIONALES
  // ==========================================================

  async findByEstado(estado: paquete_estado_paquete) {
    return this.prisma.paquete.findMany({
      where: { estado_paquete: estado },
      include: { cliente: true, ruta: true, barrio: true }
    });
  }

  async findByRuta(id_ruta: number) {
    return this.prisma.paquete.findMany({
      where: { id_ruta },
      include: { cliente: true, ruta: true, barrio: true },
      orderBy: { fecha_registro: 'desc' }
    });
  }

  async getRutasDisponibles() {
    const rutas = await this.prisma.ruta.findMany({
      where: { estado_ruta: 'Pendiente' },
      include: {
        _count: { select: { paquete: true } }
      },
      orderBy: { id_ruta: 'desc' }
    });

    return rutas;
  }
}