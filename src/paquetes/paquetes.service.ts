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
//servicio
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
    where: { id_paquete: id },
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
        fecha_registro: new Date(),
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
    if (dto.valor_declarado !== undefined) data.valor_declarado = dto.valor_declarado;
    if (dto.cantidad !== undefined) data.cantidad = dto.cantidad;
    if (dto.direccion_entrega !== undefined) data.direccion_entrega = dto.direccion_entrega;
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

  // Operaciones adicionales
  async asignar(id: number, dto: AsignarPaqueteDto) {
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    if (paquete.estado_paquete !== 'Pendiente') {
      throw new BadRequestException(
        `El paquete ya esta en estado ${paquete.estado_paquete}`
      );
    }

    const ruta = await this.prisma.ruta.findUnique({
      where: {id_ruta: dto.id_ruta}
    });
    if (!ruta) {
      throw new NotFoundException('Ruta no encontrada');
    }

    if (ruta.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        `La ruta no está disponible para asignación. Estado actual: ${ruta.estado_ruta}`
      );
    }

    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data: {
        id_ruta: dto.id_ruta,
        estado_paquete: 'Asignado'
      },
      include: {cliente: true, ruta: true, barrio: true}
    });
  }

  async reasignar(id: number, dto: AsignarPaqueteDto) {
    return this.asignar(id, dto);
  }

  async cancelar(id: number) {
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

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
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    if (paquete.estado_paquete === 'Entregado' && dto.estado !== 'Entregado') {
      throw new BadRequestException(
        'No se puede modificar un paquete ya entregado'
      );
    }

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
}