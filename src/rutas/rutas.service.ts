import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prima.service';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { CreateRutaDto } from './dto/create-ruta.dto';

@Injectable()
export class RutasService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.ruta.findMany();
  }

  getOne(id: number) {
    return this.prisma.ruta.findUnique({ where: { id_ruta: id } });
  }

  create(data: CreateRutaDto) {
    const { fecha_inicio, fecha_fin, ...rest } = data;

    // construimos el objeto sin undefined
    const payload: any = {
      ...rest,
      ...(fecha_inicio ? { fecha_inicio: new Date(fecha_inicio) } : {}),
      ...(fecha_fin ? { fecha_fin: new Date(fecha_fin) } : {}),
    };

    return this.prisma.ruta.create({ data: payload });
  }

  update(id: number, data: UpdateRutaDto) {
    const { fecha_inicio, fecha_fin, ...rest } = data;

    const payload: any = {
      ...rest,
      ...(fecha_inicio ? { fecha_inicio: new Date(fecha_inicio) } : {}),
      ...(fecha_fin ? { fecha_fin: new Date(fecha_fin) } : {}),
    };

    return this.prisma.ruta.update({
      where: { id_ruta: id },
      data: payload,
    });
  }

  delete(id: number) {
    return this.prisma.ruta.delete({ where: { id_ruta: id } });
  }
}
