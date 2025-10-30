import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param
} from '@nestjs/common';
import {GetAllRutasUseCase} from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';
import {CambiarEstadoRutaUseCase} from 'src/application/logistica/rutas/use-cases/cambiar-estado-ruta.use-case';
import {CreateRutaDto} from './dto/create-ruta.dto';
import {CambiarEstadoRutaDto} from './dto/rutas/cambiar-estado-ruta.dto';
import {CreateRutaUseCase} from 'src/application/logistica/rutas/use-cases/create-ruta.use-case';
import {CreateRutaData} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {CambiarEstadoConductorUseCase} from 'src/application/conductores/use-cases/cambiar-estado-conductor.use-case';
import {AsignarConductorUseCase} from 'src/application/logistica/rutas/use-cases/asignar-conductor.use-case';
import {AsignarConductorDto} from './dto/rutas/asignar-conductor.dto';
import {EliminarRutaUseCase} from 'src/application/logistica/rutas/use-cases/eliminar-ruta.use-case';

@Controller('rutas')
export class RutasController {
  constructor(
    private readonly getAllRutasUseCase: GetAllRutasUseCase,
    private readonly cambiarEstadoRutaUseCase: CambiarEstadoRutaUseCase,
    private readonly createRutaUseCase: CreateRutaUseCase,
    private readonly deleteRutaUseCase: EliminarRutaUseCase,
    private readonly cambiarEstadoConductorUseCase: CambiarEstadoConductorUseCase,
    private readonly asignarConductorUseCase: AsignarConductorUseCase // <-- agregado
  ) {}

  @Get()
  async getAll() {
    return await this.getAllRutasUseCase.execute();
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoRutaDto
  ) {
    const rutaId = Number(id);
    return await this.cambiarEstadoRutaUseCase.execute(rutaId, dto.nuevoEstado);
  }

  @Patch(':id/asignar-conductor')
  async asignarConductor(
    @Param('id') id: string,
    @Body() dto: AsignarConductorDto
  ) {
    const rutaId = Number(id);

    // Usar el UseCase específico para asignar conductor
    return await this.asignarConductorUseCase.execute(rutaId, dto.id_conductor);
  }

  @Post()
  async create(@Body() dto: CreateRutaDto) {
    const data: CreateRutaData = {
      estado_ruta: dto.ruta_estado ?? 'Pendiente',
      fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : new Date(),
      fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : null,
      id_conductor: dto.id_conductor,
      id_vehiculo: dto.id_vehiculo,
      cod_manifiesto: dto.cod_manifiesto ?? null
    };

    return await this.createRutaUseCase.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteRutaUseCase.execute(Number(id));
  }
}
