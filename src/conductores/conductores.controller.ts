import { Controller, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { UpdateConductorDto } from './dto/update-conductor.dto';

@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get()
  getAll() {
    return this.conductoresService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.conductoresService.getOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConductorDto) {
    return this.conductoresService.update(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.conductoresService.delete(Number(id));
  }
}
