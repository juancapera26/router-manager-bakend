// src/paquetes/paquetes.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {CreatePaqueteDto} from '../interface/controllers/dto/create-paquete.dto';
import {UpdatePaqueteDto} from '../interface/controllers/dto/update-paquete.dto';
import {AsignarPaqueteDto} from '../interface/controllers/dto/asignar-paquete.dto';
import {EstadoPaqueteDto} from '../interface/controllers/dto/estado-paquete.dto';
import {ClientesService} from '../clientes/clientes.service';
import {paquete_estado_paquete} from '@prisma/client';

@Injectable()
export class PaquetesService {
  constructor(
    private prisma: PrismaService,
    private clientesService: ClientesService
  ) {}

  getAll() {
    return this.prisma.paquete.findMany({
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  async getOne(id: number) {
    return this.prisma.paquete.findUnique({
      where: {id_paquete: id},
      include: {
        cliente: true,
        ruta: true,
        barrio: true
      }
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
        largo: dto.dimensiones.largo,
        ancho: dto.dimensiones.ancho,
        alto: dto.dimensiones.alto,
        peso: dto.dimensiones.peso,
        tipo_paquete: dto.tipo_paquete,
        cantidad: dto.cantidad,
        valor_declarado: dto.valor_declarado,
        id_cliente: nuevoCliente.id_cliente,

        direccion_entrega: dto.direccion_entrega || dto.destinatario.direccion,
        lat: dto.lat,
        lng: dto.lng,
        id_barrio: dto.id_barrio,

        estado_paquete: 'Pendiente',
        fecha_registro: new Date()
      },
      include: {
        cliente: true,
        barrio: true
      }
    });

    if (!paqueteCreado.codigo_rastreo) {
      const codigoRastreo = `PKG-${String(paqueteCreado.id_paquete).padStart(6, '0')}`;
      return this.prisma.paquete.update({
        where: {id_paquete: paqueteCreado.id_paquete},
        data: {codigo_rastreo: codigoRastreo},
        include: {
          cliente: true,
          barrio: true
        }
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
    if (dto.valor_declarado !== undefined)
      data.valor_declarado = dto.valor_declarado;
    if (dto.cantidad !== undefined) data.cantidad = dto.cantidad;
    if (dto.direccion_entrega !== undefined)
      data.direccion_entrega = dto.direccion_entrega;
    if (dto.id_ruta !== undefined) data.id_ruta = dto.id_ruta;
    if (dto.id_barrio !== undefined) data.id_barrio = dto.id_barrio;
    if (dto.lat !== undefined) data.lat = dto.lat;
    if (dto.lng !== undefined) data.lng = dto.lng;
    if (dto.fecha_entrega !== undefined) data.fecha_entrega = dto.fecha_entrega;

    if (dto.id_cliente !== undefined) {
      data.cliente = {connect: {id_cliente: dto.id_cliente}};
    }

    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data,
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  delete(id: number) {
    return this.prisma.paquete.delete({
      where: {id_paquete: id},
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  // ========== OPERACIONES ADICIONALES ==========

  async asignar(id: number, dto: AsignarPaqueteDto) {
    console.log('🎯 === MÉTODO ASIGNAR LLAMADO ===');
    console.log('📦 ID del paquete:', id);
    console.log('📄 DTO recibido:', JSON.stringify(dto, null, 2));

    // ← NUEVO: Validar que venga id_ruta O cod_manifiesto
    if (!dto.id_ruta && !dto.cod_manifiesto) {
      throw new BadRequestException('Se requiere id_ruta o cod_manifiesto');
    }

    // Buscar el paquete
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });

    if (!paquete) {
      throw new NotFoundException('Paquete no encontrado');
    }

    console.log(
      '✅ Paquete encontrado:',
      paquete.id_paquete,
      'Estado:',
      paquete.estado_paquete
    );

    if (paquete.estado_paquete !== 'Pendiente') {
      throw new BadRequestException(
        `El paquete ya está en estado ${paquete.estado_paquete}`
      );
    }

    // ← NUEVO: Buscar ruta por id_ruta O cod_manifiesto
    let ruta;

    if (dto.cod_manifiesto) {
      console.log('🔍 Buscando ruta por cod_manifiesto:', dto.cod_manifiesto);
      ruta = await this.prisma.ruta.findUnique({
        where: {cod_manifiesto: dto.cod_manifiesto}
      });
    } else if (dto.id_ruta) {
      console.log('🔍 Buscando ruta por id_ruta:', dto.id_ruta);
      ruta = await this.prisma.ruta.findUnique({
        where: {id_ruta: dto.id_ruta}
      });
    }

    if (!ruta) {
      // ← NUEVO: Debug para ver qué rutas existen
      const todasLasRutas = await this.prisma.ruta.findMany();
      console.log(
        '📋 Rutas existentes:',
        todasLasRutas.map(r => ({
          id: r.id_ruta,
          codigo: r.cod_manifiesto,
          estado: r.estado_ruta
        }))
      );

      throw new NotFoundException(
        dto.cod_manifiesto
          ? `Ruta con código ${dto.cod_manifiesto} no encontrada`
          : `Ruta con ID ${dto.id_ruta} no encontrada`
      );
    }

    console.log('✅ Ruta encontrada:', {
      id_ruta: ruta.id_ruta,
      cod_manifiesto: ruta.cod_manifiesto,
      estado: ruta.estado_ruta
    });

    if (ruta.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        `La ruta no está disponible. Estado actual: ${ruta.estado_ruta}`
      );
    }

    // ← IMPORTANTE: Siempre asignar usando id_ruta (relación interna de BD)
    console.log('🔄 Asignando paquete', id, 'a ruta', ruta.id_ruta);

    const paqueteActualizado = await this.prisma.paquete.update({
      where: {id_paquete: id},
      data: {
        id_ruta: ruta.id_ruta, // ← Siempre usar id_ruta para la relación
        estado_paquete: 'Asignado'
      },
      include: {
        cliente: true,
        ruta: true,
        barrio: true
      }
    });

    console.log('✅ Paquete asignado exitosamente');

    return paqueteActualizado;
  }

  async reasignar(id: number, dto: AsignarPaqueteDto) {
    console.log('🔄 Reasignando paquete:', id, 'DTO:', dto);
    return this.asignar(id, dto);
  }

  async cancelar(id: number) {
    console.log('❌ Cancelando asignación del paquete:', id);

    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });

    if (!paquete) {
      throw new NotFoundException('Paquete no encontrado');
    }

    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data: {
        estado_paquete: 'Pendiente',
        id_ruta: null
      },
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  async cambiarEstado(id: number, dto: EstadoPaqueteDto) {
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });

    if (!paquete) {
      throw new NotFoundException('Paquete no encontrado');
    }

    //if (paquete.estado_paquete === 'Entregado' && dto.estado !== 'Entregado') {
    //throw new BadRequestException(
    //('No se puede modificar un paquete ya entregado');
    //);
    //}

    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data: {estado_paquete: dto.estado},
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  async findByEstado(estado: paquete_estado_paquete) {
    return this.prisma.paquete.findMany({
      where: {estado_paquete: estado},
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  async findByRuta(id_ruta: number) {
    return this.prisma.paquete.findMany({
      where: {id_ruta},
      include: {
        cliente: true,
        ruta: true,
        barrio: true
      },
      orderBy: {
        fecha_registro: 'desc'
      }
    });
  }

  async getRutasDisponibles() {
    try {
      console.log('🔍 Buscando rutas disponibles...');

      const rutas = await this.prisma.ruta.findMany({
        where: {
          estado_ruta: 'Pendiente'
        },
        include: {
          _count: {
            select: {
              paquete: true
            }
          }
        },
        orderBy: {
          id_ruta: 'desc'
        }
      });

      console.log('✅ Rutas en estado Pendiente:', rutas.length);

      if (rutas.length > 0) {
        console.log(
          '📦 Rutas:',
          rutas.map(r => ({
            id: r.id_ruta,
            codigo: r.cod_manifiesto,
            estado: r.estado_ruta,
            paquetes: r._count.paquete
          }))
        );
      }

      return rutas;
    } catch (error) {
      console.error('❌ Error en getRutasDisponibles:', error);
      throw error;
    }
  }
}
