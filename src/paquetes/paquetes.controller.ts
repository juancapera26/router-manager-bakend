// paquetes.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Controller('paquetes')
export class PaquetesController {
  constructor(private readonly paquetesService: PaquetesService) {}

  @Get()
  getAll() {
    return this.paquetesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.paquetesService.getOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.create(dto);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaqueteDto) {
    return this.paquetesService.update(Number(id), dto);
  }
  
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paquetesService.delete(Number(id));
  }
}
