import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { GetAllRutasUseCase } from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';
import { CambiarEstadoRutaUseCase } from 'src/application/logistica/rutas/use-cases/cambiar-estado-ruta.use-case';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { CambiarEstadoRutaDto } from './dto/rutas/cambiar-estado-ruta.dto';
import { CreateRutaUseCase } from 'src/application/logistica/rutas/use-cases/create-ruta.use-case';
import { CreateRutaData } from 'src/domain/logistica/rutas/repositories/ruta.repository';
import { EliminarRutaUseCase } from 'src/application/logistica/rutas/use-cases/eliminar-ruta.use-case';
import { AsignarConductorUseCase } from 'src/application/logistica/rutas/use-cases/asignar-conductor.use-case';
import { AsignarConductorDto } from './dto/rutas/asignar-conductor.dto';
import { AsignarVehiculoUseCase } from 'src/application/logistica/rutas/use-cases/asignar-vehiculo.use-case';
import { AsignarVehiculoDto } from '../../application/logistica/rutas/use-cases/asignar-vehiculo.use-case';

@Controller('rutas')
export class RutasController {
  constructor(
    private readonly getAllRutasUseCase: GetAllRutasUseCase,
    private readonly cambiarEstadoRutaUseCase: CambiarEstadoRutaUseCase,
    private readonly createRutaUseCase: CreateRutaUseCase,
    private readonly deleteRutaUseCase: EliminarRutaUseCase,
    private readonly asignarConductorUseCase: AsignarConductorUseCase,
    private readonly asignarVehiculoUseCase: AsignarVehiculoUseCase
  ) {}

  /**
   * Genera un código aleatorio de manifiesto (3 letras + 3 números)
   */
  private generarCodigoManifiesto(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    let codigo = '';

    for (let i = 0; i < 3; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 3; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    return codigo;
  }

  /**
   * GET /rutas - Obtener todas las rutas
   */
  @Get()
  async getAll() {
    return await this.getAllRutasUseCase.execute();
  }

  // =========================================
  // 🚨 RUTAS ESPECÍFICAS PRIMERO (para evitar conflictos con :id)
  // =========================================

  /**
   * PATCH /rutas/:codManifiesto/asignar-conductor
   * Asigna un conductor a una ruta usando el código de manifiesto
   * 
   * Ejemplo: PATCH /rutas/dRG168/asignar-conductor
   * Body: { "id_conductor": 2 }
   */
  @Patch(':codManifiesto/asignar-conductor')
  async asignarConductor(
    @Param('codManifiesto') codManifiesto: string,
    @Body() dto: AsignarConductorDto
  ) {
    return await this.asignarConductorUseCase.execute(
      codManifiesto,
      dto.id_conductor
    );
  }

  /**
   * PATCH /rutas/:id/asignar-vehiculo - Asignar vehículo a una ruta
   */
  @Patch(':id/asignar-vehiculo')
  async asignarVehiculo(
    @Param('id') id: string,
    @Body() dto: AsignarVehiculoDto
  ) {
    const rutaId = Number(id);

    const rutas = await this.getAllRutasUseCase.execute();
    const rutaSeleccionada = rutas.find(r => r.id_ruta === rutaId);

    if (!rutaSeleccionada) {
      throw new NotFoundException('Ruta no encontrada');
    }

    if (rutaSeleccionada.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        'Solo las rutas en estado "Pendiente" pueden tener vehículos asignados'
      );
    }

    return await this.asignarVehiculoUseCase.execute(rutaId, dto.id_vehiculo);
  }

  /**
   * PATCH /rutas/:id/estado - Cambiar estado de una ruta
   */
  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoRutaDto & { adminId?: number },
    @Request() req: any
  ) {
    const rutaId = Number(id);

    const adminId = dto.adminId ?? req.user?.id_usuario;

    if (!adminId) {
      throw new BadRequestException('AdminId no encontrado en la petición');
    }

    return await this.cambiarEstadoRutaUseCase.execute(
      rutaId,
      dto.nuevoEstado
    );
  }

  /**
   * POST /rutas - Crear nueva ruta
   */
  @Post()
  async create(@Body() dto: CreateRutaDto) {
    const data: CreateRutaData = {
      estado_ruta: dto.ruta_estado ?? 'Pendiente',
      fecha_inicio: new Date(),
      fecha_fin: null,
      id_conductor: null,
      id_vehiculo: null,
      cod_manifiesto: this.generarCodigoManifiesto()
    };

    return await this.createRutaUseCase.execute(data);
  }

  /**
   * DELETE /rutas/:id - Eliminar una ruta
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteRutaUseCase.execute(Number(id));
  }
}