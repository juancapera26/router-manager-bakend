import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';

// Servicios
import {PaquetesService} from '../../paquetes/paquetes.service';

// Repositorio
import {PrismaPaqueteRepository} from 'src/infrastructure/persistence/prisma/prisma-paquete.repository';

// DTOs
import {CreatePaqueteDto} from './dto/create-paquete.dto';
import {UpdatePaqueteDto} from './dto/update-paquete.dto';
import {AsignarPaqueteDto} from './dto/asignar-paquete.dto';
import {EstadoPaqueteDto} from './dto/estado-paquete.dto';
import {RegistrarEntregaDto} from './dto/paquetes/registrar-entrega.dto';

// Tipos Prisma
import {paquete_estado_paquete} from '@prisma/client';

@Controller('paquetes')
export class PaquetesController {
  constructor(
    private readonly paquetesService: PaquetesService,
    private readonly prismaPaqueteRepository: PrismaPaqueteRepository
  ) {}

  // =========================================
  // GET ENDPOINTS
  // =========================================

  @Get()
  getAll() {
    return this.paquetesService.getAll();
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: paquete_estado_paquete) {
    return this.paquetesService.findByEstado(estado);
  }

  @Get('ruta/:id_ruta')
  findByRuta(@Param('id_ruta') id_ruta: string) {
    return this.paquetesService.findByRuta(Number(id_ruta));
  }

  @Get('rutas-disponibles')
  async getRutasDisponibles() {
    return this.paquetesService.getRutasDisponibles();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.paquetesService.getOne(Number(id));
  }

  // =========================================
  // POST ENDPOINTS
  // =========================================

  @Post()
  create(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.create(dto);
  }

  /**
   * 🔔 Registrar entrega con imagen
   * Actualiza el paquete y verifica automáticamente el estado de la ruta
   */
  @Post(':id/entrega')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/entregas',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `entrega-${uniqueSuffix}${ext}`);
        }
      })
    })
  )
  async registrarEntrega(
    @Param('id') id: string,
    @Body() dto: RegistrarEntregaDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const idPaquete = Number(id);

    // Validar que el paquete existe
    const paquete = await this.prismaPaqueteRepository.findById(idPaquete);
    if (!paquete) {
      throw new NotFoundException(`Paquete con ID ${idPaquete} no encontrado`);
    }

    // Validar que el estado sea válido
    const estadosValidos: paquete_estado_paquete[] = ['Entregado', 'Fallido'];
    if (!estadosValidos.includes(dto.estado_paquete)) {
      throw new BadRequestException(
        `Estado inválido. Debe ser 'Entregado' o 'Fallido'`
      );
    }

    // Preparar path de la imagen
    const imagePath = file ? `/uploads/entregas/${file.filename}` : null;
    const now = new Date();
    const fechaLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

    // 1️⃣ Primero: Actualizar paquete con imagen y observación
    await this.prismaPaqueteRepository.cambiarEstado(
      idPaquete,
      dto.estado_paquete,
      dto.observacion_entrega || null,
      imagePath,
      fechaLocal
    );

    // 2️⃣ Después: Usar el servicio para verificar ruta y enviar notificaciones
    const estadoDto: EstadoPaqueteDto = {
      estado: dto.estado_paquete,
    };

    const resultado = await this.paquetesService.cambiarEstado(idPaquete, estadoDto);

    return resultado;
  }

  // =========================================
  // PUT/PATCH ENDPOINTS
  // =========================================

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

  @Patch(':id/reasignar')
  reassignPaquete(
    @Param('id') id: string,
    @Body('id_conductor') id_conductor: number,
    @Body('id_ruta') id_ruta: number
  ) {
    return this.paquetesService.reasignar(Number(id), {id_ruta, id_conductor});
  }

  // =========================================
  // DELETE ENDPOINTS
  // =========================================

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paquetesService.delete(Number(id));
  }
}