import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UnauthorizedException,
  Param,
  Res,
  NotFoundException,
  StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { CrearNovedadUseCase } from '../../application/novedades/use-cases/crear-novedad.use-case';
import { ListarNovedadesUseCase } from '../../application/novedades/use-cases/listar-novedades.use-case';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { User } from 'src/auth/guards/decorators/user.decorator';
import { CrearNovedadProps } from 'src/domain/novedades/repositories/novedad.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Controller('reportes')
export class NovedadesController {
  constructor(
    private readonly crearNovedadUseCase: CrearNovedadUseCase,
    private readonly listarNovedadesUseCase: ListarNovedadesUseCase,
    private readonly prisma: PrismaService // Inyecta Prisma
  ) {}

  @Post('subir')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const nombre = `${Date.now()}${extname(file.originalname)}`;
          cb(null, nombre);
        }
      })
    })
  )
  async subirNovedad(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNovedadDto,
    @User('uid') uid?: string
  ) {
    if (!uid) throw new UnauthorizedException('Usuario no autenticado');

    const crearData: CrearNovedadProps = {
      descripcion: body.descripcion,
      tipo: body.tipo,
      id_usuario: Number(uid),
      uid,
      imagen: undefined
    };

    return this.crearNovedadUseCase.execute(crearData, file);
  }

  @Get()
  async listarNovedades() {
    return this.listarNovedadesUseCase.execute();
  }

  // NUEVO: Endpoint para historial
  @Get('historial')
  @UseGuards(FirebaseAuthGuard)
  async obtenerHistorial() {
    return this.listarNovedadesUseCase.execute();
  }

  // NUEVO: Endpoint para servir imágenes
  @Get('imagen/:id')
  @UseGuards(FirebaseAuthGuard)
  async obtenerImagen(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    try {
      // Buscar la novedad
      const novedad = await this.prisma.novedades.findUnique({
        where: { id_novedad: Number(id) }
      });

      if (!novedad || !novedad.imagen) {
        throw new NotFoundException('Imagen no encontrada');
      }

      // Construir ruta completa del archivo
      // novedad.imagen viene como "/uploads/1234567890.jpg"
      const rutaCompleta = join(process.cwd(), novedad.imagen);

      // Verificar si existe
      if (!existsSync(rutaCompleta)) {
        throw new NotFoundException('Archivo de imagen no existe en el servidor');
      }

      // Crear stream del archivo
      const file = createReadStream(rutaCompleta);

      // Detectar tipo de contenido
      const extension = extname(novedad.imagen).toLowerCase();
      const contentType = this.getContentType(extension);

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${novedad.imagen.split('/').pop()}"`,
      });

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error al obtener la imagen');
    }
  }

  // Método auxiliar para detectar content type
  private getContentType(extension: string): string {
    const types: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
    };
    return types[extension] || 'application/octet-stream';
  }
}