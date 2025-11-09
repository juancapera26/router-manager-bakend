import {Body, Controller, Post, Get, Param} from '@nestjs/common';
import {CrearUbicacionUseCase} from '../../application/ubicaciones/use-cases/crear-ubicacion.use-case';
import {CreateUbicacionDto} from './dto/ubicaciones/create-ubicacion.dto';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly crearUbicacion: CrearUbicacionUseCase) {}

  @Post()
  async crear(@Body() dto: CreateUbicacionDto) {
    // Llama al UseCase para crear o actualizar
    return this.crearUbicacion.execute(dto.id_ruta, dto.lat, dto.lng);
  }

  @Get(':id_ruta')
  async getByRuta(@Param('id_ruta') id_ruta: string) {
    const rutaId = Number(id_ruta);
    // Llama al UseCase para traer las ubicaciones de la ruta
    return this.crearUbicacion.getUbicaciones(rutaId);
  }
}
