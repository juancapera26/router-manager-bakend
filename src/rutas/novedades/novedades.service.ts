import {Injectable} from '@nestjs/common';
import {CreateNovedadDto} from './dto/create-novedad.dto';
import {PrismaService} from 'prisma/prima.service';

@Injectable()
export class NovedadesService {
  constructor(private prisma: PrismaService) {}

  async crearNovedad(
    data: CreateNovedadDto,
    file?: Express.Multer.File,
    usuarioId?: number
  ) {
    return this.prisma.novedades.create({
      data: {
        descripcion: data.descripcion,
        tipo: data.tipo,
        fecha: new Date(),
        id_usuario: usuarioId ?? 1,
        imagen: file ? `/uploads/${file.filename}` : (data.imagen ?? null)
      }
    });
  }

  async listarNovedades() {
    return this.prisma.novedades.findMany({
      include: {usuario: true} // opcional: trae datos del usuario
    });
  }
}
