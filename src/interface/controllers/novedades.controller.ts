// interface/controllers/novedades.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {CreateNovedadDto} from './dto/create-novedad.dto';
import {CrearNovedadUseCase} from '../../application/novedades/use-cases/crear-novedad.use-case';
import {ListarNovedadesUseCase} from '../../application/novedades/use-cases/listar-novedades.use-case';
import {ObtenerNovedadUseCase} from '../../application/novedades/use-cases/obtener-novedades.use-case';
import {EliminarNovedadUseCase} from '../../application/novedades/use-cases/eliminar-novedad.use-case';
import {FirebaseAuthGuard} from 'src/auth/guards/firebase-auth.guard';
import {User} from 'src/auth/guards/decorators/user.decorator';
import {CrearNovedadProps} from 'src/domain/novedades/repositories/novedad.repository';

@Controller('reportes')
export class NovedadesController {
  constructor(
    private readonly crearNovedadUseCase: CrearNovedadUseCase,
    private readonly listarNovedadesUseCase: ListarNovedadesUseCase,
    private readonly obtenerNovedadUseCase: ObtenerNovedadUseCase,
    private readonly eliminarNovedadUseCase: EliminarNovedadUseCase
  ) {}

  // Subir una novedad
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

  // Listar novedades
  @Get('historial')
  async listarNovedades() {
    console.log('🔍 GET /reportes/historial - Listando novedades');
    return this.listarNovedadesUseCase.execute();
  }

  // Obtener una novedad por ID
  @Get('historial/:id')
  async obtenerNovedad(@Param('id') id: string) {
    console.log('🔍 GET /reportes/historial/:id - ID:', id);
    return this.obtenerNovedadUseCase.execute(Number(id));
  }

  // Eliminar novedad (SIN GUARD por ahora)
  @Delete('historial/:id')
  async eliminarNovedad(@Param('id') id: string) {
    console.log('🗑️ DELETE /reportes/historial/:id - ID:', id);
    return this.eliminarNovedadUseCase.execute(Number(id));
  }
}
