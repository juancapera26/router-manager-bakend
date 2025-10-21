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
import {ClientesService} from '../clientes/clientes.service'; // 👈 importar service de clientes

@Injectable()
export class PaquetesService {
  constructor(
    private prisma: PrismaService,
    private clientesService: ClientesService // 👈 inyectar
  ) {}

  // 🔹 CRUD básico
  getAll() {
    return this.prisma.paquete.findMany({
      include: {cliente: true} // 👈 para ver también los datos del destinatario
    });
  }

  getOne(id: number) {
    return this.prisma.paquete.findUnique({
      where: {id_paquete: id},
      include: {cliente: true}
    });
  }
  ///aqui iba el resto de codigo
  async create(dto: CreatePaqueteDto) {
    // 👇 Validación: si no hay id_cliente pero sí los datos de cliente, lo creamos
    if (!dto.id_cliente && dto.cliente) {
      const nuevoCliente = await this.clientesService.create(dto.cliente);
      dto.id_cliente = nuevoCliente.id_cliente;
    }

    if (!dto.id_cliente) {
      throw new BadRequestException(
        'Debe especificar un cliente existente o los datos del destinatario'
      );
    }

    return this.prisma.paquete.create({
      data: {
        largo: dto.largo,
        ancho: dto.ancho,
        alto: dto.alto,
        peso: dto.peso,
        id_cliente: dto.id_cliente,
        tipo_paquete: dto.tipo_paquete,
        valor_declarado: dto.valor_declarado,
        cantidad: dto.cantidad,
        direccion_entrega: dto.direccion_entrega,
        id_ruta: dto.id_ruta,
        id_barrio: dto.id_barrio,
        lat: dto.lat,
        lng: dto.lng,
        fecha_entrega: dto.fecha_entrega,
        fecha_registro: new Date() // 👈 agregado
      },
      include: {cliente: true}
    });
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
      data
    });
  }

  delete(id: number) {
    return this.prisma.paquete.delete({
      where: {id_paquete: id},
      include: {cliente: true}
    });
  }

  // 🔹 Operaciones adicionales
  async asignar(id: number, dto: AsignarPaqueteDto) {
    const paquete = await this.prisma.paquete.findUnique({
      where: {id_paquete: id}
    });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data: {
        id_ruta: dto.id_ruta,
        estado_paquete: 'Asignado'
      },
      include: {cliente: true}
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
      data: {estado_paquete: 'Pendiente'},
      include: {cliente: true}
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
      include: {cliente: true}
    });
  }
}
