// paquetes.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaqueteDto } from '../interface/controllers/dto/create-paquete.dto';
import { UpdatePaqueteDto } from '../interface/controllers/dto/update-paquete.dto';
import { AsignarPaqueteDto } from '../interface/controllers/dto/asignar-paquete.dto';
import { EstadoPaqueteDto } from '../interface/controllers/dto/estado-paquete.dto';

@Injectable()
export class PaquetesService {
  constructor(private prisma: PrismaService) {}

  // 🔹 CRUD básico
  getAll() {
    return this.prisma.paquete.findMany();
  }

  getOne(id: number) {
    return this.prisma.paquete.findUnique({where: {id_paquete: id}});
  }

  // create(data: CreatePaqueteDto) {
  //   return this.prisma.paquete.create({data});
  // }

  update(id: number, data: UpdatePaqueteDto) {
    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data
    });
  }
  delete(id: number) {
    return this.prisma.paquete.delete({where: {id_paquete: id}});
  }

  // 🔹 Operaciones adicionales
  async asignar(id: number, dto: AsignarPaqueteDto) {
    const paquete = await this.prisma.paquete.findUnique({ where: { id_paquete: id } });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    return this.prisma.paquete.update({
      where: { id_paquete: id },
      data: {
        id_ruta: dto.id_ruta,
        estado_paquete: 'Asignado',
      },
    });
  }
 
}
