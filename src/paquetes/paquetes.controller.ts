import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';

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
  create(@Body() data: any) {
    return this.paquetesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.paquetesService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paquetesService.delete(Number(id));
  }
}
