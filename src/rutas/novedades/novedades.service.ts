import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateNovedadDto } from '../../interface/controllers/dto/create-novedad.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NovedadesService {
  constructor(private prisma: PrismaService) {}

  async crearNovedad(
    data: CreateNovedadDto,
    file?: Express.Multer.File,
    usuarioId?: number
  ) {
    if (!usuarioId) {
      throw new BadRequestException('ID de usuario es requerido');
    }

    try {
      return await this.prisma.novedades.create({
        data: {
          descripcion: data.descripcion,
          tipo: data.tipo,
          fecha: new Date(),
          id_usuario: usuarioId,
          imagen: file ? `/uploads/${file.filename}` : data.imagen
        }
      });
    } catch (error) {
      throw new BadRequestException(`Error al crear novedad: ${error.message}`);
    }
  }

  async listarNovedades() {
    try {
      return await this.prisma.novedades.findMany({
        include: { usuario: true }
      });
    } catch (error) {
      throw new BadRequestException(`Error al listar novedades: ${error.message}`);
    }
  }
}