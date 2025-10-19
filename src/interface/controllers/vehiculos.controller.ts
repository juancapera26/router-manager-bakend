// src/interface/controllers/vehiculos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {CreateVehiculoDto} from './dto/vehiculos/create-vehiculo.dto';
import {UpdateVehiculoDto} from './dto/vehiculos/update-vehiculo.dto';
import {GetAllVehiculosUseCase} from '../../application/logistica/vehiculos/use-cases/get-all-vehiculos.use-case';
import {GetVehiculoUseCase} from '../../application/logistica/vehiculos/use-cases/get-vehiculo.use-case';
import {CreateVehiculoUseCase} from '../../application/logistica/vehiculos/use-cases/create-vehiculo.use-case';
import {UpdateVehiculoUseCase} from '../../application/logistica/vehiculos/use-cases/update-vehiculo.use-case';
import {DeleteVehiculoUseCase} from '../../application/logistica/vehiculos/use-cases/delete-vehiculo.use-case';
import {UpdateEstadoVehiculoUseCase} from '../../application/logistica/vehiculos/use-cases/update-estado-vehiculo.use-case';

@Controller('vehiculos')
export class VehiculosController {
  constructor(
    private readonly getAllVehiculosUseCase: GetAllVehiculosUseCase,
    private readonly getVehiculoUseCase: GetVehiculoUseCase,
    private readonly createVehiculoUseCase: CreateVehiculoUseCase,
    private readonly updateVehiculoUseCase: UpdateVehiculoUseCase,
    private readonly deleteVehiculoUseCase: DeleteVehiculoUseCase,
    private readonly updateEstadoVehiculoUseCase: UpdateEstadoVehiculoUseCase
  ) {}

  /**
   * GET /vehiculos
   * Obtener todos los vehículos
   */
  @Get()
  async getAll() {
    const vehiculos = await this.getAllVehiculosUseCase.execute();
    return {
      success: true,
      message: 'Vehículos obtenidos exitosamente',
      data: vehiculos
    };
  }

  /**
   * GET /vehiculos/:id
   * Obtener un vehículo por ID
   */
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const vehiculo = await this.getVehiculoUseCase.execute(id);
    return {
      success: true,
      message: 'Vehículo obtenido exitosamente',
      data: vehiculo
    };
  }

  /**
   * POST /vehiculos
   * Crear un nuevo vehículo
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return await this.createVehiculoUseCase.execute(createVehiculoDto);
  }

  /**
   * PUT /vehiculos/:id
   * Actualizar un vehículo
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculoDto: UpdateVehiculoDto
  ) {
    return await this.updateVehiculoUseCase.execute(id, updateVehiculoDto);
  }

  /**
   * PATCH /vehiculos/:id/estado
   * Cambiar el estado de disponibilidad de un vehículo
   */
  @Patch(':id/estado')
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('disponible') disponible: boolean
  ) {
    return await this.updateEstadoVehiculoUseCase.execute(id, disponible);
  }

  /**
   * DELETE /vehiculos/:id
   * Eliminar un vehículo
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.deleteVehiculoUseCase.execute(id);
  }
}
