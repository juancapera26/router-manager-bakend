import {
  Controller,
  Post,
  Get,
  Body,
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
import {FirebaseAuthGuard} from 'src/auth/guards/firebase-auth.guard';
import {User} from 'src/auth/guards/decorators/user.decorator';
import {CrearNovedadProps} from 'src/domain/novedades/repositories/novedad.repository';

@Controller('reportes')
export class NovedadesController {
  constructor(
    private readonly crearNovedadUseCase: CrearNovedadUseCase,
    private readonly listarNovedadesUseCase: ListarNovedadesUseCase
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
    @UploadedFile() file: Express.MulterFile,
    @Body() body: CreateNovedadDto,
    @User('uid') uid?: string
  ) {
    if (!uid) throw new UnauthorizedException('Usuario no autenticado');

    const crearData: CrearNovedadProps = {
      descripcion: body.descripcion,
      tipo: body.tipo,
      id_usuario: Number(uid), // si tu DB espera number
      uid, // ya incluido en el objeto
      imagen: undefined // se llenará en el UseCase si hay archivo
    };

    return this.crearNovedadUseCase.execute(crearData, file);
  }

  @Get()
  async listarNovedades() {
    return this.listarNovedadesUseCase.execute();
  }
}
