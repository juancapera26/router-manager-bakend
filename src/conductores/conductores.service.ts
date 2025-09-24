import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConductorDto } from './dto/update-conductor.dto';

@Injectable()
export class ConductoresService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.usuario.findMany({
      where: { id_rol: 2 }, // solo conductores
    });
  }

  async getOne(id: number) {
    const conductor = await this.prisma.usuario.findFirst({
      where: { id_usuario: id, id_rol: 2 },
    });

    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    return conductor;
  }

  async update(id: number, data: UpdateConductorDto) {
    const conductor = await this.prisma.usuario.findFirst({
      where: { id_usuario: id, id_rol: 2 },
    });

    if (!conductor) {
      throw new ForbiddenException('No se puede actualizar: el usuario no es un conductor');
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  async delete(id: number) {
    const conductor = await this.prisma.usuario.findFirst({
      where: { id_usuario: id, id_rol: 2 },
    });

    if (!conductor) {
      throw new ForbiddenException('No se puede eliminar: el usuario no es un conductor');
    }

    return this.prisma.usuario.delete({ where: { id_usuario: id } });
  }
}
