// rutas.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  getAll() {
    return this.rutasService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.rutasService.getOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateRutaDto) {
    return this.rutasService.create(dto);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRutaDto) {
    return this.rutasService.update(Number(id), dto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rutasService.delete(Number(id));
  }
}
