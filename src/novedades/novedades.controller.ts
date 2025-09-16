import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {CreateNovedadDto} from './dto/create-novedad.dto';
import {NovedadesService} from './novedades.service';
import {diskStorage} from 'multer';
import {extname} from 'path';

@Controller('reportes')
export class NovedadesController {
  constructor(private readonly novedadesService: NovedadesService) {}

  @Post('subir')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const nombre = `${Date.now()}${extname(file.originalname)}`;
          cb(null, nombre);
        }
      })
    })
  )
  async subirNovedad(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNovedadDto
  ) {
    return this.novedadesService.crearNovedad(body, file, 1); // ⚡ luego pasar usuario real
  }

  @Get()
  async listarNovedades() {
    return this.novedadesService.listarNovedades();
  }
}
