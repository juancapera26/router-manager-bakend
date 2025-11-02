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
        },
        include: { usuario: true }
      });
    } catch (error) {
      throw new BadRequestException(`Error al crear novedad: ${error.message}`);
    }
  }

  async listarNovedades() {
    try {
      const novedades = await this.prisma.novedades.findMany({
        include: { usuario:{
          select: {
            id_usuario:true,
            nombre:true,
            apellido:true
          }
        } },
        orderBy: { fecha: 'desc' } 
      });
      
      console.log('📦 Novedades obtenidas:', novedades.length);
      if (novedades.length > 0) {
        console.log('📦 Primera novedad:', JSON.stringify(novedades[0], null, 2));
      }
      
      return novedades;
    } catch (error) {
      console.error('❌ Error al listar novedades:', error);
      throw new BadRequestException(`Error al listar novedades: ${error.message}`);
    }
  }

  async obtenerNovedadPorId(id: number) {
    try {
      const novedad = await this.prisma.novedades.findUnique({
        where: { id_novedad: id },
        include: { usuario: true }
      });

      if (!novedad) {
        throw new BadRequestException('Novedad no encontrada');
      }
      
      console.log('📦 Novedad obtenida:', novedad.id_novedad);
      return novedad;
    } catch (error) {
      console.error('❌ Error al obtener novedad:', error);
      throw new BadRequestException(`Error al obtener novedad: ${error.message}`);
    }
  }

  async eliminarNovedad(id: number) {
    try {
      const novedad = await this.prisma.novedades.findUnique({
        where: { id_novedad: id }
      });

      if (!novedad) {
        throw new BadRequestException('Novedad no encontrada');
      }

      const eliminada = await this.prisma.novedades.delete({
        where: { id_novedad: id }
      });
      
      console.log('🗑️ Novedad eliminada:', id);
      return eliminada;
    } catch (error) {
      console.error('❌ Error al eliminar novedad:', error);
      throw new BadRequestException(`Error al eliminar novedad: ${error.message}`);
    }
  }
}