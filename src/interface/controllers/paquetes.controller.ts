// paquetes.controller.ts
import {Controller, Get, Put, Delete, Body, Param} from '@nestjs/common';
import {PaquetesService} from '../../paquetes/paquetes.service';
import {UpdatePaqueteDto} from './dto/update-paquete.dto';
import {AsignarPaqueteDto} from './dto/asignar-paquete.dto';
import {EstadoPaqueteDto} from './dto/estado-paquete.dto';

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
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaqueteDto) {
    return this.paquetesService.update(Number(id), dto);
  }

  @Put(':id/asignar')
  asignar(@Param('id') id: string, @Body() dto: AsignarPaqueteDto) {
    return this.paquetesService.asignar(Number(id), dto);
  }

  @Put(':id/reasignar')
  reasignar(@Param('id') id: string, @Body() dto: AsignarPaqueteDto) {
    return this.paquetesService.reasignar(Number(id), dto);
  }

  @Put(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.paquetesService.cancelar(Number(id));
  }

  @Put(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: EstadoPaqueteDto) {
    return this.paquetesService.cambiarEstado(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paquetesService.delete(Number(id));
  }
}
