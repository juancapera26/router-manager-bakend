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
import {EliminarRutaUseCase} from 'src/application/logistica/rutas/use-cases/eliminar-ruta.use-case';
import {AsignarConductorUseCase} from 'src/application/logistica/rutas/use-cases/asignar-conductor.use-case';
import {AsignarConductorDto} from './dto/rutas/asignar-conductor.dto';
import {AsignarVehiculoUseCase} from 'src/application/logistica/rutas/use-cases/asignar-vehiculo.use-case';
// 🛑 IMPORTACIÓN CORREGIDA para mantener consistencia con los otros DTOs
import {AsignarVehiculoDto} from 'src/application/logistica/rutas/use-cases/asignar-vehiculo.use-case';

@Controller('rutas')
export class RutasController {
  constructor(
    private readonly getAllRutasUseCase: GetAllRutasUseCase,
    private readonly cambiarEstadoRutaUseCase: CambiarEstadoRutaUseCase,
    private readonly createRutaUseCase: CreateRutaUseCase,
    private readonly deleteRutaUseCase: EliminarRutaUseCase,
    private readonly asignarConductorUseCase: AsignarConductorUseCase,
    // ✅ AGREGADO: UseCase para asignar vehículo
    private readonly asignarVehiculoUseCase: AsignarVehiculoUseCase 
  ) {}

  // Función para generar un código de manifiesto aleatorio (3 letras + 3 números)
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

    // Obtener la ruta a asignar
    const rutas = await this.getAllRutasUseCase.execute();
    const rutaSeleccionada = rutas.find(r => r.id_ruta === rutaId);

    if (!rutaSeleccionada) {
      throw new Error('Ruta no encontrada');
    }

    // Validar que la ruta esté en estado "Pendiente"
    if (rutaSeleccionada.estado_ruta !== 'Pendiente') {
      throw new Error(
        'Solo las rutas en estado "Pendiente" pueden ser asignadas'
      );
    }

    // Llamar al UseCase para asignar el conductor
    return await this.asignarConductorUseCase.execute(rutaId, dto.id_conductor);
  }

  // ✅ NUEVO ENDPOINT: Asignar Vehículo
  @Patch(':id/asignar-vehiculo')
  async asignarVehiculo(
    @Param('id') id: string,
    @Body() dto: AsignarVehiculoDto
  ) {
    const rutaId = Number(id);

    // Obtener la ruta a asignar
    const rutas = await this.getAllRutasUseCase.execute();
    const rutaSeleccionada = rutas.find(r => r.id_ruta === rutaId);

    if (!rutaSeleccionada) {
      throw new Error('Ruta no encontrada');
    }

    // Validar que la ruta esté en estado "Pendiente"
    if (rutaSeleccionada.estado_ruta !== 'Pendiente') {
      throw new Error(
        'Solo las rutas en estado "Pendiente" pueden tener vehículos asignados'
      );
    }

    // Llamar al UseCase para asignar el vehículo
    return await this.asignarVehiculoUseCase.execute(rutaId, dto.id_vehiculo);
  }

  @Post()
  async create(@Body() dto: CreateRutaDto) {
    const data: CreateRutaData = {
      estado_ruta: dto.ruta_estado ?? 'Pendiente',
      fecha_inicio: new Date(), // Fecha de inicio actual
      fecha_fin: null, // Fecha de fin no proporcionada
      id_conductor: null, // No es obligatorio
      id_vehiculo: null, // No es obligatorio
      cod_manifiesto: this.generarCodigoManifiesto() // Generamos un código aleatorio (3 letras + 3 números)
    };

    return await this.createRutaUseCase.execute(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteRutaUseCase.execute(Number(id));
  }
}